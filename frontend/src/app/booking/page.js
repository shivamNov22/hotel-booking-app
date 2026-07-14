"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingHeader from "@/components/user/BookingHeader";
import BookingRoomCard from "@/components/user/BookingRoomCard";
import BookingPageSkeleton from "@/components/user/BookingPageSkeleton";
import RoomsBreakdownEditor from "@/components/user/RoomsBreakdownEditor";
import AddOnsList from "@/components/user/AddOnsList";
import PromoCodeBox from "@/components/user/PromoCodeBox";
import ReservationSummary from "@/components/user/ReservationSummary";
import GuestInfoForm from "@/components/user/GuestInfoForm";
import PaymentSection from "@/components/user/PaymentSection";
import ReservationPolicy from "@/components/user/ReservationPolicy";
import PropertyTabsContent from "@/components/user/PropertyTabsContent";
import {
  useGetBookingDetailsQuery,
  useCreateBookingMutation,
} from "@/redux/api/bookingApi";
import { useGetAddOnsQuery } from "@/redux/api/addOnApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/redux/api/paymentApi";
import { calculateNights, estimatePricing } from "@/lib/pricingEstimate";

const EMPTY_GUEST_INFO = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  city: "",
  country: "India",
  specialRequest: "",
};

function defaultRoom() {
  return { adults: 1, childrenBelow5: 0, children5to12: 0 };
}

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get("roomId");

  // Two-tier date state: "pending" is what the user is editing in the date
  // pickers, "applied" is what's actually sent to the API — only updated
  // when "Check Availability" is clicked, matching the reference UI.
  const [pendingCheckIn, setPendingCheckIn] = useState(
    searchParams.get("checkIn") || "",
  );
  const [pendingCheckOut, setPendingCheckOut] = useState(
    searchParams.get("checkOut") || "",
  );
  const [appliedCheckIn, setAppliedCheckIn] = useState(
    searchParams.get("checkIn") || "",
  );
  const [appliedCheckOut, setAppliedCheckOut] = useState(
    searchParams.get("checkOut") || "",
  );

  const [roomsCount, setRoomsCount] = useState(1);
  const [roomsBreakdown, setRoomsBreakdown] = useState([defaultRoom()]);
  const [mealPlan, setMealPlan] = useState("Room Only");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountAmount, discountType }
  const [guestInfo, setGuestInfo] = useState(EMPTY_GUEST_INFO);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("Property Info");

  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState(null); // "booking" | "order" | "verifying"
  const [submitError, setSubmitError] = useState("");

  const {
    data: detailsData,
    isLoading: isDetailsLoading,
    isFetching: isDetailsFetching,
    isError: isDetailsError,
    error: detailsError,
  } = useGetBookingDetailsQuery(
    { roomId, checkIn: appliedCheckIn, checkOut: appliedCheckOut },
    { skip: !roomId || !appliedCheckIn || !appliedCheckOut },
  );

  const { data: addOnsData, isLoading: isAddOnsLoading } = useGetAddOnsQuery();

  const [createBooking] = useCreateBookingMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // Keep roomsBreakdown array length in sync with roomsCount
  const handleRoomsCountChange = (newCount) => {
    setRoomsCount(newCount);
    setRoomsBreakdown((prev) => {
      if (newCount > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: newCount - prev.length }, defaultRoom),
        ];
      }
      return prev.slice(0, newCount);
    });
  };

  const handleCheckAvailability = () => {
    setAppliedCheckIn(pendingCheckIn);
    setAppliedCheckOut(pendingCheckOut);
    // A date change invalidates any promo already applied against the old total
    setAppliedPromo(null);
  };

  const nights = calculateNights(appliedCheckIn, appliedCheckOut);
  const basePrice = detailsData?.data?.pricing?.basePricePerNight || 0;
  const room = detailsData?.data?.room;

  const totalAdults = roomsBreakdown.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomsBreakdown.reduce(
    (sum, r) => sum + r.childrenBelow5 + r.children5to12,
    0,
  );

  const selectedAddOns = useMemo(
    () =>
      (addOnsData?.addOns || []).filter((a) =>
        selectedAddOnIds.includes(a.addOnId),
      ),
    [addOnsData, selectedAddOnIds],
  );

  const pricing = useMemo(
    () =>
      estimatePricing({
        basePrice,
        nights,
        roomsCount,
        roomsBreakdown,
        selectedAddOns,
        promoDiscountAmount: appliedPromo?.discountAmount || 0,
      }),
    [
      basePrice,
      nights,
      roomsCount,
      roomsBreakdown,
      selectedAddOns,
      appliedPromo,
    ],
  );

  const toggleAddOn = (addOnId) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId],
    );
  };

  const validateBeforeSubmit = () => {
    if (roomsCount < 1) return "Please select at least 1 room.";
    const { firstName, lastName, email, phone } = guestInfo;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      return "Please fill in all required guest details.";
    }
    return null;
  };

  const handleMakePayment = async () => {
    const validationMessage = validateBeforeSubmit();
    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      let bookingId = createdBookingId;

      if (!bookingId) {
        setSubmitStage("booking");
        const payload = {
          roomId,
          checkIn: appliedCheckIn,
          checkOut: appliedCheckOut,
          roomsCount,
          roomsBreakdown: roomsBreakdown.map((r, i) => ({
            roomNumber: i + 1,
            ...r,
          })),
          mealPlan,
          addOnIds: selectedAddOnIds,
          promoCode: appliedPromo?.code || "",
          guestInfo,
          termsAccepted,
        };
        const bookingRes = await createBooking(payload).unwrap();
        bookingId = bookingRes.booking.bookingId;
        setCreatedBookingId(bookingId);
      }

      setSubmitStage("order");
      const orderRes = await createOrder(bookingId).unwrap();

      setSubmitStage("verifying");
      // Dummy gateway — simulate a brief processing delay before "confirming"
      await new Promise((resolve) => setTimeout(resolve, 900));
      await verifyPayment({
        bookingId,
        orderId: orderRes.order.orderId,
        paymentId: `pay_${Date.now()}`,
        signature: "",
        status: "success",
      }).unwrap();

      router.push(`/booking-confirmation/${bookingId}`);
    } catch (err) {
      setSubmitError(
        err?.data?.message || "Something went wrong. Please try again.",
      );
      setIsSubmitting(false);
      setSubmitStage(null);
    }
  };

  if (!roomId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center">
        <p className="text-trinity-900/60">
          No room selected. Please go back and pick a room to book.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg bg-trinity-500 px-5 py-2 text-sm font-medium text-white hover:bg-trinity-600"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <BookingHeader
        checkIn={pendingCheckIn}
        checkOut={pendingCheckOut}
        onCheckInChange={setPendingCheckIn}
        onCheckOutChange={setPendingCheckOut}
        onCheckAvailability={handleCheckAvailability}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {(isDetailsLoading || isDetailsFetching) && <BookingPageSkeleton />}

      {isDetailsError && (
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-red-600">
            {detailsError?.data?.message ||
              "Couldn't load this room's details. Please try again."}
          </p>
        </div>
      )}

      {!isDetailsLoading && !isDetailsFetching && !isDetailsError && room && (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <BookingRoomCard room={room} pricePerNight={basePrice} />

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <RoomsBreakdownEditor
                  roomsCount={roomsCount}
                  roomsBreakdown={roomsBreakdown}
                  mealPlan={mealPlan}
                  pricePerNight={basePrice}
                  nights={nights}
                  onRoomsCountChange={handleRoomsCountChange}
                  onRoomsBreakdownChange={setRoomsBreakdown}
                  onMealPlanChange={setMealPlan}
                />
              </div>

              <AddOnsList
                addOns={addOnsData?.addOns}
                isLoading={isAddOnsLoading}
                selectedIds={selectedAddOnIds}
                onToggle={toggleAddOn}
                totalAdults={totalAdults}
                totalChildren={totalChildren}
              />

              <GuestInfoForm guestInfo={guestInfo} onChange={setGuestInfo} />

              <PaymentSection
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
                onSubmit={handleMakePayment}
                isSubmitting={isSubmitting}
                submitError={submitError}
                submitStage={submitStage}
              />

              <ReservationPolicy />

              <div className="rounded-2xl bg-white p-2 shadow-sm">
                <div className="flex flex-wrap gap-2 p-2">
                  {[
                    "Property Info",
                    "Photo Gallery",
                    "Facilities",
                    "Location",
                  ].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        activeTab === tab
                          ? "bg-trinity-500 text-white"
                          : "text-trinity-900/60 hover:bg-cream"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <PropertyTabsContent activeTab={activeTab} />
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="space-y-4">
                <PromoCodeBox
                  bookingAmount={pricing.roomCharges}
                  onApplied={setAppliedPromo}
                  onCleared={() => setAppliedPromo(null)}
                />
                <ReservationSummary
                  checkIn={appliedCheckIn}
                  checkOut={appliedCheckOut}
                  nights={nights}
                  pricing={pricing}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
