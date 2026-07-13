# Hotel Booking Frontend

A responsive, SEO-friendly hotel booking application built with Next.js 16
(App Router), Tailwind CSS, and Redux Toolkit + RTK Query. The UI and booking
flow are modeled on the Trinity Suites Bangalore booking engine
(`hotels.eglobe-solutions.com`): date search bar, room selection with
occupancy and meal plans, add-ons, guest information, Razorpay-style payment,
promo codes, a live reservation summary, and property info/gallery/facilities/
location tabs.

## Tech stack

- **Next.js 16** – App Router, file-based routing, server metadata for SEO
- **JavaScript** – no TypeScript
- **Tailwind CSS** – utility-first styling, fully responsive
- **Redux Toolkit** – local booking-flow state (`src/store/slices`)
- **RTK Query** – all data fetching/mutations (`src/store/api`)
- **Axios** – powers a custom RTK Query `baseQuery` (`axiosBaseQuery.js`)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000` — it redirects to
`/hotels/trinity-suites-bangalore-bangalore?checkIn=...&nights=1#bookingsteps`,
matching the reference site's URL shape.

## Project structure

```
src/
  app/
    api/                     # Mock backend (Next.js route handlers)
      hotels/[slug]/route.js
      hotels/[slug]/availability/route.js
      promo/route.js
      bookings/route.js
    hotels/[hotelSlug]/page.js  # Booking page + generateMetadata (SEO)
    layout.js, providers.js, globals.css
    sitemap.js, robots.js, not-found.js
  components/
    layout/                  # Header, Footer
    booking/                 # DateSearchBar, RoomCard, AddOns, GuestInfoForm,
                              # PaymentSection, PaymentModal, ReservationPolicy,
                              # PropertyTabs, BookingFlow (page orchestrator)
    sidebar/                 # PromoCode, ReservationSummary, TrustBadges
    ui/                      # Button, Input, Select, Checkbox
  store/
    store.js                 # configureStore
    slices/bookingSlice.js   # search dates, room/add-on selections, guest info,
                              # promo, payment method, policy acceptance
    api/                     # apiSlice, axiosInstance, axiosBaseQuery,
                              # hotelApi, bookingApi (RTK Query endpoints)
    selectors/pricingSelectors.js  # memoized grand-total calculation
  data/mockHotel.js          # Seed content matching the reference screenshots
  utils/                     # formatCurrency, dateUtils
```

## How the API layer works

There's no external backend for this exercise, so `src/app/api/**` provides
mock endpoints (hotel detail, availability, promo validation, booking
creation) using Next.js route handlers. RTK Query talks to them through a
shared Axios instance (`axiosBaseQuery.js`), so swapping in a real backend
later only means changing `NEXT_PUBLIC_API_BASE_URL` and, if needed, the
response shape in `hotelApi.js` / `bookingApi.js` — no component changes
required.

Valid demo promo codes (see `src/app/api/promo/route.js`):
`SAVE10` (10% off), `TRINITY5` (5% off), `WELCOME500` (flat INR 500 off).

## Booking flow

1. **Date Search Bar** – edit check-in/check-out, updates nights + summary.
2. **Available Rooms** – pick room quantity, meal plan, and per-room
   adults/children counts.
3. **Add to your stay** – optional add-ons (airport pickup, meals, etc).
4. **Guest Information** – required for payment to unlock.
5. **Make Payment** – Razorpay-style modal; on confirm, calls the
   `createBooking` mutation and shows a confirmation screen.
6. **Reservation Summary / Promo Code / Trust badges** – sticky sidebar,
   recalculated live via a memoized Redux selector.

## Responsive & accessibility notes

- Layout collapses from a two-column desktop grid to a single column on
  mobile/tablet (`lg:grid-cols-[1fr_360px]`).
- Visible focus rings, `aria-label`/`aria-labelledby` on all major sections,
  `role="dialog"` + `aria-modal` on the payment modal, `prefers-reduced-motion`
  respected in `globals.css`.
