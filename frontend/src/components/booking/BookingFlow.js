"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useGetHotelBySlugQuery } from "@/store/api/hotelApi";
import { useCreateBookingMutation } from "@/store/api/bookingApi";
import { makeSelectPricing } from "@/store/selectors/pricingSelectors";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DateSearchBar from "@/components/booking/DateSearchBar";
import RoomCard from "@/components/booking/RoomCard";
import AddOns from "@/components/booking/AddOns";
import GuestInfoForm from "@/components/booking/GuestInfoForm";
import PaymentSection from "@/components/booking/PaymentSection";
import PaymentModal from "@/components/booking/PaymentModal";
import ReservationPolicy from "@/components/booking/ReservationPolicy";
import PropertyTabs from "@/components/booking/PropertyTabs";
import PromoCode from "@/components/sidebar/PromoCode";
import ReservationSummary from "@/components/sidebar/ReservationSummary";
import TrustBadges from "@/components/sidebar/TrustBadges";

export default function BookingFlow({ slug }) {
  const { data: hotel, isLoading, isError } = useGetHotelBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading hotel details…
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        We couldn&apos;t find this property. Please check the link and try
        again.
      </div>
    );
  }

  return <BookingFlowContent hotel={hotel} />;
}

function BookingFlowContent({ hotel }) {
  const nights = useSelector((state) => state.booking.search.nights);
  const guestInfo = useSelector((state) => state.booking.guestInfo);
  const policyAccepted = useSelector((state) => state.booking.policyAccepted);
  const promo = useSelector((state) => state.booking.promo);
  const roomSelections = useSelector((state) => state.booking.roomSelections);
  const addOnsState = useSelector((state) => state.booking.addOns);
  const search = useSelector((state) => state.booking.search);

  const selectPricing = useMemo(() => makeSelectPricing(hotel), [hotel]);
  const pricing = useSelector(selectPricing);

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [formError, setFormError] = useState("");

  const canPay =
    pricing.hasSelection &&
    guestInfo.firstName.trim() &&
    guestInfo.lastName.trim() &&
    guestInfo.email.trim() &&
    guestInfo.phone.trim() &&
    policyAccepted;

  function handleMakePayment() {
    setFormError("");
    if (!pricing.hasSelection) {
      setFormError("Please select at least one room before proceeding.");
      return;
    }
    if (!canPay) {
      setFormError(
        "Please complete guest information and accept the reservation policy."
      );
      return;
    }
    setShowPaymentModal(true);
  }

  async function handleConfirmPayment() {
    try {
      const result = await createBooking({
        hotelSlug: hotel.slug,
        search,
        roomSelections,
        addOns: addOnsState,
        guestInfo,
        promo,
        grandTotal: pricing.grandTotal,
      }).unwrap();
      setConfirmation(result);
      setShowPaymentModal(false);
    } catch (err) {
      setFormError(
        err?.data?.message || "Payment could not be completed. Try again."
      );
      setShowPaymentModal(false);
    }
  }

  function scrollToRooms() {
    document
      .getElementById("rooms")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (confirmation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-navy px-4 text-center text-white">
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-white/80">
          Confirmation number:{" "}
          <span className="font-semibold">
            {confirmation.confirmationNumber}
          </span>
        </p>
        <p className="max-w-md text-sm text-white/70">
          A confirmation email has been sent to {guestInfo.email}. We look
          forward to hosting you at {hotel.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header hotel={hotel} />
      <DateSearchBar />

      <main
        id="bookingsteps"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8"
      >
        <div className="space-y-6">
          <section id="rooms" aria-labelledby="rooms-heading" className="space-y-4">
            <h2
              id="rooms-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Available Rooms
            </h2>
            {hotel.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                nights={nights}
                onBookNow={scrollToRooms}
              />
            ))}
          </section>

          <AddOns addOns={hotel.addOns} />
          <GuestInfoForm />
          {formError && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </p>
          )}
          <PaymentSection
            onMakePayment={handleMakePayment}
            canPay={canPay}
            isLoading={isBooking}
          />
          <ReservationPolicy policy={hotel.policy} />
          <PropertyTabs hotel={hotel} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <PromoCode subtotal={pricing.totalCharges} />
          <ReservationSummary pricing={pricing} />
          <TrustBadges badges={hotel.trustBadges} />
        </aside>
      </main>

      <Footer />

      {showPaymentModal && (
        <PaymentModal
          amount={pricing.grandTotal}
          isLoading={isBooking}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
