# Trinity Suites — Frontend (Admin + User, one Next.js project)

Next.js (App Router, JavaScript) + Tailwind CSS + Redux Toolkit & RTK Query.

Four phases have been built into this one project so far:
1. **Admin Frontend** — Dashboard + Room Inventory (CRUD), under `/admin/*`
2. **User Rooms page** — public homepage (`/`) listing all rooms
3. **User Booking flow** — `/booking` and `/booking-confirmation/[bookingId]`, fully wired to the backend booking + payment APIs
4. **Manage My Booking** (this step) — `/my-bookings`, a dedicated lookup-first journey backed by `GET /api/bookings/lookup`

Running on Next.js 16 (App Router, Turbopack), React 19 and Tailwind CSS v4.

---

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

- `http://localhost:3000/` → public Rooms page
- `http://localhost:3000/admin` → Admin panel (redirects to `/admin/dashboard`)

---

## Routing overview

| Route | Purpose |
|---|---|
| `/` | Public homepage — Rooms grid |
| `/booking?roomId=&checkIn=&checkOut=` | **New.** Full booking page — room details, add-ons, promo, guest info, payment |
| `/booking-confirmation/[bookingId]` | Final confirmed booking summary, after payment succeeds |
| `/my-bookings` | **New.** Manage My Booking — lookup form first, booking details after a successful lookup, Rooms only if the guest chooses to keep browsing |
| `/admin/*` | Admin panel (unchanged from before) |

---

## The Booking Flow — how it actually works end to end

```
Homepage RoomCard → "Book This Room" clicked
   │
   ├─ calls GET /api/bookings/details (roomId, checkIn, checkOut) — validates the room/dates
   │     ├─ success → router.push("/booking?roomId=...&checkIn=...&checkOut=...")
   │     └─ failure → inline error shown on the card, no navigation
   │
/booking page loads
   │
   ├─ GET /api/bookings/details        → room card, per-night price
   ├─ GET /api/addons                   → "Add to your stay" checkboxes
   ├─ POST /api/promo/validate            → "Apply" button, discount preview (not saved)
   ├─ (client-side) live Reservation Summary — see lib/pricingEstimate.js
   │
   User fills Guest Information + selects rooms/add-ons/meal plan, accepts terms,
   clicks "Make Payment"
   │
   ├─ POST /api/bookings                  → creates a Pending booking, returns bookingId + authoritative pricing
   ├─ POST /api/payments/create-order       → dummy order created
   ├─ (900ms simulated delay)
   ├─ POST /api/payments/verify              → status: "success" → booking → Confirmed
   │
   └─ router.push("/booking-confirmation/{bookingId}")
         └─ GET /api/bookings/:bookingId       → final confirmed summary
```

If `POST /api/bookings` succeeds but a later step (`create-order` or `verify`) fails, the
already-created `bookingId` is remembered (`createdBookingId` state in `booking/page.js`) —
clicking "Make Payment" again retries from the payment step instead of creating a
duplicate booking.

---

## What's real vs. what's placeholder

| Section | Status |
|---|---|
| Room details, add-ons, promo validation, booking creation, payment (dummy), confirmation | ✅ Fully real, fully integrated |
| Live Reservation Summary while filling the form | ✅ Real formula, but client-computed for instant feedback — the authoritative total always comes back from `POST /api/bookings`. See the `ESTIMATED_TAX_PERCENT` note in `lib/pricingEstimate.js`: it duplicates the backend's tax rate since there's no public endpoint exposing it yet. |
| Payment gateway | 🟡 Fully dummy — `POST /api/payments/verify` is called with a hardcoded `status: "success"`. No real card/UPI flow. |
| Admin Login (header, both pages) | ✅ Real — calls `POST /api/auth/admin/login`; on success redirects to `/admin/dashboard`; on failure shows "Invalid admin credentials. You are not authorized to access the Admin Panel." (the backend only returns a generic "Invalid email or password" for both a wrong password and a non-admin account — this message is translated on the frontend for clarity, not changed on the backend) |
| Property Info / Photo Gallery / Facilities / Location tabs | 🟡 Static placeholder content — no backend field exists for any of these yet (see notes inside `PropertyTabsContent.js`) |
| Reservation Policy & Terms text | 🟡 Static placeholder — no backend field for property policy yet |
| "Manage My Booking" / language selector (booking page header) | 🟡 Disabled, visual only — matches the reference UI but isn't built |

---

## Design decisions worth knowing about
- **No "Deal" struck-through pricing.** The reference UI shows an original price crossed out next to a discounted one (e.g. ~~INR 4,000~~ INR 3,600) — that's a room-level automatic discount separate from Promo Code, and there's no field for it in the `Room` model. The booking page shows the real `basePrice` plainly instead of fabricating a fake original price.
- **Payment branding.** The reference UI shows the real Razorpay logo/UI. Since there's no real gateway wired in, the payment section uses a neutral "Secure Payment Gateway (Test Mode)" label instead of reproducing a real payment provider's branding for a non-functional flow.
- **Location tab** uses a generic Google Maps embed (Bangalore, as a placeholder) — swap the query in `PropertyTabsContent.js` for the property's real address once available.
- **Multiple room types on one booking page.** The reference UI's booking engine shows every room type on the same page (Executive Suite, Luxury Suite, etc.) so the guest can pick any of them there. In this flow, the guest already picked one specific room from the homepage card, so `/booking` shows only that one room — simpler and matches how the homepage → booking handoff was specified.

---

## Folder structure (new additions from this step, in bold)
```
src/
 ├── app/
 │    ├── booking/page.js                          the full booking page
 │    ├── booking-confirmation/
 │    │    └── [bookingId]/page.js                  final confirmation (now uses BookingSummaryDetails)
 │    └── my-bookings/page.js                      **NEW — Manage My Booking (lookup → details → Rooms)**
 │
 ├── components/
 │    ├── shared/
 │    │    ├── StatusBadge.js
 │    │    ├── Skeleton.js                           generic shimmer block
 │    │    └── AdminLoginModal.js                      used in both headers
 │    └── user/
 │         ├── Header.js                              (updated — added Manage My Booking link)
 │         ├── RoomCard.js                             calls the booking API before navigating
 │         ├── RoomCardSkeleton.js                       -
 │         ├── BookingHeader.js                           (updated — Manage My Booking button now links to /my-bookings)
 │         ├── BookingRoomCard.js                          room preview on /booking
 │         ├── BookingPageSkeleton.js                        -
 │         ├── RoomsBreakdownEditor.js                         Select Room / Meal Plan / per-room pax
 │         ├── AddOnsList.js                                    -
 │         ├── PromoCodeBox.js                                   -
 │         ├── ReservationSummary.js                              -
 │         ├── GuestInfoForm.js                                    -
 │         ├── PaymentSection.js                                    -
 │         ├── ReservationPolicy.js                                  static
 │         ├── PropertyTabsContent.js                                  static
 │         ├── BookingLookupForm.js                                     **NEW — Booking Ref. Number + Email form**
 │         └── BookingSummaryDetails.js                                  **NEW — shared by /my-bookings and /booking-confirmation**
 │
 ├── lib/
 │    ├── amenityIcons.js
 │    └── pricingEstimate.js                          **NEW — client-side live pricing preview**
 │
 └── redux/api/
      ├── apiSlice.js
      ├── roomApi.js
      ├── bookingApi.js                              **NEW — details / create / confirmation / lookup**
      ├── addOnApi.js                                  **NEW**
      ├── promoApi.js                                    **NEW**
      ├── paymentApi.js                                    **NEW**
      └── authApi.js                                        **NEW — admin login**
```

All new API files use `apiSlice.injectEndpoints(...)` on the same shared `apiSlice` — no new store wiring was needed, `store.js` is unchanged.

---

## Next steps
1. Wire up a real payment gateway (replace the dummy `create-order`/`verify` calls) once one is chosen.
2. Add backend fields/endpoints for Property Info, Photo Gallery, Facilities, and Location so those tabs stop being static.
3. Expose the tax percentage via a small public endpoint so `lib/pricingEstimate.js` doesn't have to duplicate the backend's `TAX_PERCENT` constant.
4. ~~Build "Manage My Booking"~~ — done in this step (`/my-bookings`, using the existing `GET /api/bookings/lookup` endpoint and `useLazyLookupBookingQuery`).
5. Everything flagged in the previous README steps (public rooms endpoint before admin auth guard, admin login page consuming a route guard, etc.) still applies.

---

## Framework upgrade (this step)

Upgraded from Next.js 14 to the latest stable line, plus all compatible dependencies:

| Package | Before | After |
|---|---|---|
| `next` | 14.2.5 | ^16.2.10 |
| `react` / `react-dom` | ^18.3.1 | ^19.2.0 |
| `@reduxjs/toolkit` | ^2.2.7 | ^2.12.0 |
| `react-redux` | ^9.1.2 | ^9.3.0 |
| `lucide-react` | ^0.383.0 | ^1.24.0 |
| `tailwindcss` | ^3.4.7 | ^4.3.2 |

What changed as part of the upgrade:
- **Tailwind v4** moved to CSS-first config: `tailwind.config.js` was removed and its theme (colors, font) now lives in `@theme { ... }` inside `src/app/globals.css`. `postcss.config.js` now uses `@tailwindcss/postcss` instead of `tailwindcss` + `autoprefixer` (v4 includes vendor-prefixing internally). All existing utility classes (`bg-trinity-500`, `text-trinity-900/60`, `bg-cream`, `bg-status-available-bg`, etc.) resolve to the same values as before.
- **`next lint` was removed in Next.js 16.** Linting now runs through the ESLint CLI directly — see the new `eslint.config.mjs` — and `npm run lint` now runs `eslint` instead of `next lint`.
- No code changes were needed for the App Router's async `params`/`searchParams` change in Next 15/16 — every dynamic route or search-param usage in this project already reads them via the client-side `useParams()` / `useSearchParams()` hooks rather than a server component prop, so nothing here was affected.
- `next.config.js`, `jsconfig.json`, and the App Router file layout are unchanged and remain valid on Next 16.
- Requires **Node.js 20.9+** (declared in `package.json` under `engines`).

After pulling this change, reinstall dependencies from a clean slate and verify the build:
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
npm run dev
```
