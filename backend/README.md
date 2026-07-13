# Hotel Booking Backend Documentation

Complete backend for a hotel booking system: Admin manages room inventory,
customers browse rooms, apply promo codes and add-ons, book a room, pay
(dummy gateway for now), and can look up their booking later.

This document explains **everything** — folder structure, setup, every
module, every API endpoint with real request/response examples, and how the
whole flow connects end to end.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Setup & Running Locally](#setup--running-locally)
5. [The Complete Flow ](#the-complete-flow)
6. [Authentication & Authorization](#authentication--authorization)
7. [Module 1 — Auth APIs](#module-1--auth-apis)
8. [Module 2 — Admin Room Inventory APIs](#module-2--admin-room-inventory-apis)
9. [Module 3 — Booking Details API (Room Preview)](#module-3--booking-details-api-room-preview)
10. [Module 4 — Add-ons API](#module-4--add-ons-api)
11. [Module 5 — Promo Code APIs](#module-5--promo-code-apis)
12. [Module 6 — Create Booking API (the pricing engine)](#module-6--create-booking-api-the-pricing-engine)
13. [Module 7 — Payment APIs (dummy gateway)](#module-7--payment-apis-dummy-gateway)
14. [Module 8 — View Booking APIs](#module-8--view-booking-apis)
15. [Error Handling Convention](#error-handling-convention)
16. [Database Models — Field Reference](#database-models--field-reference)
17. [Seed Scripts](#seed-scripts)
18. [Known Gaps / Recommended Next Steps](#known-gaps--recommended-next-steps)

---

## Tech Stack

- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — database
- **JWT (jsonwebtoken)** + **httpOnly cookies** — authentication
- **bcryptjs** — password hashing
- **express-validator** — Auth route validation
- **Joi** — all other modules' validation (Room, Booking, Promo, Payment)
- **cors, cookie-parser, dotenv** — standard Express middleware

---

## Folder Structure

```
backend/
 ├── config/
 │    └── db.js                     # MongoDB connection
 │    └── pricingConfig.js           # tax %, currency, gateway name (central config)
 ├── controllers/
 │    ├── authController.js
 │    ├── roomInventoryController.js
 │    ├── bookingDetailsController.js
 │    ├── bookingCreateController.js
 │    ├── promoController.js
 │    ├── addOnController.js
 │    └── paymentController.js
 ├── middleware/
 │    ├── authMiddleware.js          # protect, authorize (JWT guard + role check)
 │    ├── validateRequest.js          # express-validator error formatter (Auth routes)
 │    ├── validate.js                  # Joi error formatter (all other routes)
 │    └── errorMiddleware.js            # notFound + global errorHandler
 ├── models/
 │    ├── Admin.js
 │    ├── User.js
 │    ├── Room.js                     # Admin Room Inventory
 │    ├── Booking.js                   # full booking record incl. payment info
 │    ├── PromoCode.js
 │    ├── AddOn.js
 │    └── Payment.js                    # currently unused — see Known Gaps
 ├── node_modules/
 ├── routes/
 │    ├── authRoutes.js
 │    ├── roomInventoryRoutes.js
 │    ├── bookingRoutes.js
 │    ├── promoRoutes.js
 │    ├── addOnRoutes.js
 │    └── paymentRoutes.js
 ├── scripts/
 │    ├── createAdmin.js               # one-off: create first admin account
 │    └── seedAddOn.js                  # one-off/re-runnable: seed Add-on catalog
 ├── services/
 │    ├── roomInventoryService.js
 │    ├── bookingDetailsService.js
 │    ├── bookingCreateService.js       # the pricing engine
 │    ├── promoService.js
 │    ├── addOnService.js
 │    └── paymentService.js
 ├── utils/
 │    ├── generateRoomId.js             # RS001, RS002...
 │    ├── generateBookingId.js           # BK0001, BK0002...
 │    ├── dummyPaymentGateway.js          # fake order/payment id generator
 │    ├── asyncHandler.js                 # wraps async controllers, forwards errors
 │    ├── AppError.js                      # custom error class (message + statusCode)
 │    ├── generateToken.js                  # signs the JWT
 │    └── sendTokenResponse.js               # sets cookie + sends { token, data }
 ├── validations/
 │    ├── roomInventoryValidation.js
 │    ├── bookingDetailsValidation.js
 │    ├── bookingCreateValidation.js
 │    ├── bookingLookupValidation.js
 │    ├── promoValidation.js
 │    └── paymentValidation.js
 ├── .env
 ├── .gitignore
 ├── package.json
 ├── postman_collection.json
 └── server.js
```

---

## Environment Variables

Create a `.env` file in the project root with:

| Variable              | Example                                       | Purpose                                                  |
| --------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `PORT`                | `5000`                                        | server port                                              |
| `NODE_ENV`            | `development`                                 | enables verbose error stack traces when not `production` |
| `MONGODB_URI`         | `mongodb://127.0.0.1:27017/hotel-booking-app` | database connection string                               |
| `CLIENT_URL`          | `http://localhost:3000`                       | allowed CORS origin                                      |
| `JWT_SECRET`          | `some-long-random-string`                     | signs/verifies auth tokens                               |
| `COOKIE_EXPIRES_DAYS` | `7`                                           | how long the auth cookie stays valid                     |

---

## Setup & Running Locally

```bash
npm install
```

1. Create your `.env` file (see above).
2. Create the first admin account (no public admin-signup endpoint, by design):
   ```bash
   node scripts/createAdmin.js "Admin Name" admin@example.com StrongPassword123
   ```
3. Seed the Add-on catalog (needed for the "Add to your stay" section):
   ```bash
   node scripts/seedAddOn.js
   ```
4. Start the server:
   ```bash
   npm start   # or: node server.js
   ```
5. Health check: `GET http://localhost:5000/api/health` → `{ "success": true, "message": "API is running" }`

---

## The Complete Flow

**Side A — Admin sets up the hotel:**

1. Admin logs in (`POST /api/auth/admin/login`) and gets a JWT.
2. Admin creates rooms via the Room Inventory APIs (`POST /api/admin/rooms`) — room name, type, price, image, amenities, availability status.

**Side B — Customer books a room:**

1. Customer opens the Rooms page — frontend shows rooms (built from Admin's data, via a public rooms-listing endpoint on your frontend/CMS side).
2. Customer picks check-in/check-out dates and clicks **"Book Now"** on a room card.
3. Frontend redirects to the **Booking Details page** with `roomId`, `checkIn`, `checkOut` → calls `GET /api/bookings/details` to show room info + price.
4. Customer selects number of rooms + adults/children per room, meal plan.
5. `GET /api/addons` renders the "Add to your stay" checkboxes (Airport Pickup, Dinner, Lunch, Railway Pickup) — customer ticks the ones they want.
6. Customer types a promo code and clicks **Apply** → `POST /api/promo/validate` shows a discount preview (nothing saved yet).
7. Customer fills **Guest Information** and clicks the final **"Book Now"** button →
   `POST /api/bookings` — this is where the server _authoritatively_ recalculates everything (room price, promo discount, add-on charges, taxes) and creates a booking with `bookingStatus: "Pending"`.
8. Customer clicks **"Make Payment"** → `POST /api/payments/create-order` (dummy order created) → payment widget opens.
9. On payment completion → `POST /api/payments/verify` → booking becomes `Confirmed` (or `PaymentFailed`).
10. Booking Confirmation page loads via `GET /api/bookings/:bookingId`.
11. Anytime later, customer can find their booking again via the **"My Bookings"** page → `GET /api/bookings/lookup?bookingId=&email=`.

---

## Authentication & Authorization

- JWT is issued on register/login and sent **both** as a `token` field in the JSON response **and** as an `httpOnly` cookie named `token`.
- `protect` middleware (`middleware/authMiddleware.js`) reads the token from the `Authorization: Bearer <token>` header OR the cookie, verifies it, and loads the account (`User` or `Admin` depending on the token's `role`) onto `req.user`.
- `authorize(...roles)` middleware restricts a route to specific roles (e.g. `authorize("admin")`).
- Two separate models/roles: `User` (role: `customer`) and `Admin` (role: `admin`) — separate login endpoints (`/api/auth/login` vs `/api/auth/admin/login`).

---

## Module 1 — Auth APIs

Base path: `/api/auth`

### `POST /api/auth/register` — for guest info

```json
// Request
{
  "name": "Shivam Keshari",
  "email": "shivam@example.com",
  "password": "StrongPass123",
  "phone": "+919876543210"
}
```

```json
// Response (201)
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOi...",
  "data": { "_id": "...", "name": "Shivam Keshari", "email": "shivam@example.com", "role": "customer", ... }
}
```

`400` if email already registered, or validation fails (name/email/password/phone rules).

### `POST /api/auth/login` — Customer login

```json
{ "email": "shivam@example.com", "password": "StrongPass123" }
```

`200` with token + user data, or `401` — `"Invalid email or password"`.

### `POST /api/auth/admin/login` — Admin login

Same shape as customer login, but checks the `Admin` collection instead.

Header: `Authorization: Bearer <token>` (or rely on the cookie).

```json
{ "success": true, "message": "Profile fetched successfully", "data": { ...req.user } }
```

`401` if no/invalid/expired token.

### `PUT /api/auth/profile` — Update customer profile (protected, customer only)

```json
{ "name": "Shivam K.", "phone": "9876543210", "city": "Bangalore" }
```

Only `name, phone, address, city, country` are editable. `403` if an Admin token calls this route.

---

## Module 2 — Admin Room Inventory APIs

Base path: `/api/admin/rooms`

| Method | Endpoint             | Purpose                                                            |
| ------ | -------------------- | ------------------------------------------------------------------ |
| GET    | `/`                  | list rooms — search, filter by type/availability, sort, pagination |
| GET    | `/:roomId`           | single room (prefill edit form)                                    |
| POST   | `/`                  | add new room                                                       |
| PUT    | `/:roomId`           | edit room (partial update)                                         |
| PATCH  | `/:roomId/amenities` | edit amenities only                                                |
| DELETE | `/:roomId`           | delete room                                                        |

**`GET /?search=deluxe&roomType=Executive Suite&availabilityStatus=Available&sortBy=price_desc&page=1&limit=10`**

```json
{
  "success": true,
  "rooms": [
    {
      "roomId": "RS001",
      "roomName": "Executive Suite",
      "roomType": "Executive Suite",
      "image": "https://...",
      "basePrice": 4500,
      "availabilityStatus": "Available",
      "amenities": ["WiFi", "AC"]
    }
  ],
  "pagination": {
    "totalRooms": 48,
    "currentPage": 1,
    "totalPages": 5,
    "rowsPerPage": 10
  }
}
```

**`POST /`**

```json
{
  "roomName": "Deluxe Family",
  "roomType": "Deluxe",
  "image": "https://example.com/room.jpg",
  "basePrice": 6000,
  "availabilityStatus": "Available",
  "amenities": ["WiFi", "TV"]
}
```

`roomId` (RS00X) is auto-generated — never send it. `roomType` enum: `Executive Suite | Deluxe | Single`. `availabilityStatus` enum: `Available | Occupied | Maintenance`.

> ⚠️ **This module currently has no `protect`/`authorize("admin")` guard.** Now that Auth exists, add it to every route here (`router.use(protect, authorize("admin"))` at the top of `roomInventoryRoutes.js`) before going to production — right now anyone can create/edit/delete rooms without logging in.

---

## Module 3 — Booking Details API (Room Preview)

Base path: `/api/bookings`

### `GET /details?roomId=RS001&checkIn=2026-08-01&checkOut=2026-08-02`

Called right after "Book Now" is clicked on the Rooms page — shows the room card on the Booking Details page (Image 4).

```json
{
  "success": true,
  "message": "Booking details fetched successfully",
  "data": {
    "room": {
      "roomId": "RS001",
      "roomName": "Executive Suite",
      "roomType": "Executive Suite",
      "image": "...",
      "amenities": ["WiFi", "AC", "TV"],
      "availabilityStatus": "Available"
    },
    "pricing": { "basePricePerNight": 4500, "nights": 1, "totalPrice": 4500 },
    "stay": { "checkIn": "2026-08-01", "checkOut": "2026-08-02", "nights": 1 }
  }
}
```

`404` room not found · `400` room not `Available`, or invalid/missing date params.

---

## Module 4 — Add-ons API

Base path: `/api/addons`

### `GET /`

```json
{
  "success": true,
  "addOns": [
    {
      "addOnId": "ADDON001",
      "name": "Airport Pick Up Charges",
      "pricingBasis": "flat",
      "flatPrice": 1100
    },
    {
      "addOnId": "ADDON002",
      "name": "Dinner Charges",
      "pricingBasis": "per_person",
      "pricePerAdult": 300,
      "pricePerChild": 150
    }
  ]
}
```

---

## Module 5 — Promo Code APIs

Base path: `/api/promo`

### `POST /validate` — "Apply" button (preview only, nothing saved)

```json
{ "promoCode": "SAVE10", "bookingAmount": 16000 }
```

```json
{
  "success": true,
  "message": "Promo code applied successfully",
  "discount": { "type": "percentage", "value": 10, "amount": 1600 }
}
```

`400` for invalid/expired/limit-reached/below-minimum codes.

### `POST /` — create a promo code (basic admin support)

```json
{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "maxDiscountAmount": 2000,
  "minBookingAmount": 1000,
  "validFrom": "2026-03-14",
  "validTill": "2026-11-15",
  "usageLimit": 500
}
```

> ⚠️ Same as Room Inventory — this create route should be behind `protect, authorize("admin")` before production.

---

## Module 6 — Create Booking API (the pricing engine)

Base path: `/api/bookings`

### `POST /` — final "Book Now" + Guest Info submit

```json
{
  "roomId": "RS001",
  "checkIn": "2026-08-01",
  "checkOut": "2026-08-02",
  "roomsCount": 4,
  "roomsBreakdown": [
    { "roomNumber": 1, "adults": 1, "childrenBelow5": 0, "children5to12": 0 },
    { "roomNumber": 2, "adults": 1, "childrenBelow5": 0, "children5to12": 0 },
    { "roomNumber": 3, "adults": 1, "childrenBelow5": 0, "children5to12": 0 },
    { "roomNumber": 4, "adults": 1, "childrenBelow5": 0, "children5to12": 0 }
  ],
  "mealPlan": "Room Only",
  "addOnIds": ["ADDON001", "ADDON002", "ADDON003"],
  "promoCode": "",
  "guestInfo": {
    "firstName": "Shivam",
    "lastName": "Keshari",
    "email": "shivam@example.com",
    "countryCode": "+91",
    "phone": "9876543210",
    "city": "Bangalore",
    "country": "India",
    "specialRequest": "Late check-in around 11 PM"
  },
  "termsAccepted": true
}
```

```json
// Response (201)
{
  "success": true,
  "message": "Booking created successfully, proceed to payment",
  "booking": {
    "bookingId": "BK0001",
    "bookingStatus": "Pending",
    "pricingBreakdown": {
      "roomCharges": 16000,
      "totalDiscount": 0,
      "taxableAmount": 16000,
      "taxPercent": 5,
      "totalTaxes": 800,
      "addOnCharges": 6800,
      "grandTotal": 23600
    }
  }
}
```

**How the price is calculated (nothing here trusts the frontend — every rate is re-fetched server-side):**

```
roomCharges   = Room.basePrice × nights × roomsCount
totalDiscount = promo discount (re-validated against PromoCode collection, even if /promo/validate already showed a preview)
taxableAmount = roomCharges − totalDiscount
totalTaxes    = taxableAmount × TAX_PERCENT%   (TAX_PERCENT lives in config/pricingConfig.js)
addOnCharges  = sum of each selected add-on's real price from the AddOn catalog (flat, or per-adult/per-child × pax counts)
grandTotal    = taxableAmount + totalTaxes + addOnCharges
```

**Validation errors (400):** invalid/expired promo, room not `Available`, `roomsBreakdown` length ≠ `roomsCount`, invalid/inactive add-on IDs, missing guest fields, `termsAccepted: false`.
**404:** room not found.

---

## Module 7 — Payment APIs (dummy gateway)

Base path: `/api/payments`

### `POST /create-order` — "Make Payment" click

```json
{ "bookingId": "BK0001" }
```

```json
{
  "success": true,
  "message": "Order created",
  "order": {
    "orderId": "order_9f2a1b3c4d5e6f70",
    "amount": 2360000,
    "currency": "INR",
    "bookingId": "BK0001"
  }
}
```

`amount` is in paise (smallest unit) — standard for Razorpay-style gateways. `400` if booking isn't `Pending` or already `Paid`. `404` if booking not found.

### `POST /verify` — payment result callback (dummy — real signature check comes later)

```json
{
  "bookingId": "BK0001",
  "orderId": "order_9f2a1b3c4d5e6f70",
  "paymentId": "pay_abc123",
  "signature": "",
  "status": "success"
}
```

- `status: "success"` → `bookingStatus: "Confirmed"`, `paymentInfo.status: "Paid"`, promo `usedCount` incremented (only now, not at booking creation — avoids burning a code on an abandoned booking).
- `status: "failed"` → `bookingStatus: "PaymentFailed"`, `paymentInfo.status: "Failed"`.

**Swapping in a real gateway later:** only `services/paymentService.js` (real SDK call instead of the dummy order id) and `validations/paymentValidation.js` (require & verify a real HMAC `signature` instead of trusting a `status` flag) need to change.

---

## Module 8 — View Booking APIs

Base path: `/api/bookings`

### `GET /:bookingId` — Booking Confirmation page (right after payment redirect)

No extra check — frontend already knows its own `bookingId` from the same session.

### `GET /lookup?bookingId=BK0001&email=shivam@example.com` — "My Bookings" search form

Requires **both** `bookingId` and matching `email` — since `bookingId`s are sequential/guessable, email acts as a lightweight ownership check. Wrong bookingId and wrong email return the **same generic `404`** message, so the endpoint can't be used to check whether an email has any booking.

Both return the same shape:

```json
{
  "success": true,
  "booking": {
    "bookingId": "BK0001", "bookingStatus": "Confirmed",
    "stayDetails": { "checkIn": "...", "checkOut": "...", "nights": 1, "roomsCount": 4 },
    "room": { "roomName": "Executive Suite", "roomType": "...", "image": "...", "pricePerNight": 4500, "mealPlan": "Room Only" },
    "roomsBreakdown": [ ... ],
    "addOns": [ ... ],
    "guestInfo": { ... },
    "promoApplied": { ... },
    "pricingBreakdown": { ... },
    "paymentInfo": { "status": "Paid", "amountPaid": 23600, "paymentId": "...", "orderId": "...", "paidAt": "..." }
  }
}
```

Note: the payment gateway's internal `signature` is deliberately never returned — it's a server-side-only verification detail.

---

## Error Handling Convention

Two parallel patterns exist in this codebase (both fine, just know which module uses which):

**Auth module** — `express-validator` + `validateRequest` middleware + `AppError` + `asyncHandler`:

```js
throw new AppError("Invalid email or password", 401);
```

caught automatically by `asyncHandler`, forwarded to the global `errorHandler`, which also auto-formats Mongoose `CastError`, duplicate-key (`11000`), and `ValidationError`.

**Everything else (Room, Booking, Promo, Payment)** — Joi via the `validate(schema, property)` middleware for input validation, and a simple `{ statusCode, message }` thrown from services, caught in each controller's own try/catch.

Standard error response shape (both patterns):

```json
{ "success": false, "message": "...human readable message..." }
```

Unmatched routes → `404` via `notFound` middleware: `"Route not found - /api/whatever"`.

---

## Database Models — Field Reference

| Model         | Key fields                                                                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**     | name, email (unique), password (hashed, hidden), role: `admin`                                                                                                                                                                                                                   |
| **User**      | name, email (unique), password (hashed, hidden), phone, address, city, country, role: `customer`                                                                                                                                                                                 |
| **Room**      | roomId (auto RS00X), roomName, roomType (enum), image (URL), basePrice, availabilityStatus (enum), amenities[]                                                                                                                                                                   |
| **PromoCode** | code (unique), discountType (`percentage`/`flat`), discountValue, maxDiscountAmount, minBookingAmount, validFrom/Till, usageLimit, usedCount, isActive                                                                                                                           |
| **AddOn**     | addOnId (unique), name, description, pricingBasis (`flat`/`per_person`), flatPrice, pricePerAdult, pricePerChild, isActive                                                                                                                                                       |
| **Booking**   | bookingId (auto BK000X), roomId, roomSnapshot, checkIn/checkOut, nights, roomsCount, roomsBreakdown[], mealPlan, addOns[], promoApplied, pricingBreakdown, guestInfo, termsAccepted, bookingStatus (enum), paymentInfo (gateway, orderId, paymentId, status, amountPaid, paidAt) |
| **Payment**   | _(present in `models/` but not referenced by any current controller/service — see Known Gaps)_                                                                                                                                                                                   |

---

## Seed Scripts

### `node scripts/createAdmin.js "Admin Name" admin@example.com StrongPassword123`

One-off — creates the first Admin account directly in the DB (no public admin-signup endpoint by design).

### `node scripts/seedAddOn.js`

Re-runnable (upsert-based) — seeds the 4 standard add-ons (Airport Pickup, Dinner, Lunch, Railway Pickup) into the `AddOn` catalog.

---

## Known Gaps / Recommended Next Steps

1. **Admin routes aren't auth-protected yet.** `roomInventoryRoutes.js` (all of it) and `promoRoutes.js`'s `POST /` should get `router.use(protect, authorize("admin"))` now that Auth exists — right now they're open to anyone.
2. **`models/Payment.js` looks unused.** Current payment state lives entirely inside `Booking.paymentInfo`. If nothing in `controllers/` or `services/` imports `Payment.js`, it's safe to delete — you flagged this yourself as possible leftover code.
3. **No date-range double-booking check yet.** `Booking` has a `{roomId, checkIn, checkOut}` index ready for it, but `bookingCreateService.js` doesn't currently query for overlapping _Confirmed_ bookings before allowing a new one — worth adding before going live.
4. **The room-card "Deal" discount (e.g. INR 4,000 → INR 3,600) isn't modeled yet.** It's separate from Promo Code. If you want it, add `dealDiscountPercent`, `dealValidFrom`, `dealValidTill` to `Room.js` and fold it into `roomCharges` in `bookingCreateService.js`.
5. **Payment gateway is fully dummy.** `paymentService.js` generates fake order/payment IDs and `paymentValidation.js` trusts a client-sent `status: "success"/"failed"` flag. Before going live, swap in a real gateway SDK and verify a real HMAC signature instead.
6. **Consider a webhook endpoint** (`POST /api/payments/webhook`) for async server-to-server payment confirmation, in case the frontend's `/verify` call is missed (browser closed, network drop, etc.).
