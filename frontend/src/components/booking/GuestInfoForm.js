"use client";

import { useSelector, useDispatch } from "react-redux";
import { updateGuestInfo } from "@/store/slices/bookingSlice";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function GuestInfoForm() {
  const dispatch = useDispatch();
  const guestInfo = useSelector((state) => state.booking.guestInfo);

  function handleChange(field, value) {
    dispatch(updateGuestInfo({ [field]: value }));
  }

  return (
    <section
      aria-labelledby="guest-info-heading"
      id="guest-information"
      className="rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <h2
        id="guest-info-heading"
        className="rounded-t-lg bg-brand-blue px-4 py-3 text-base font-semibold text-white sm:px-6"
      >
        Guest Information
      </h2>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
        <Input
          label="First Name"
          placeholder="First Name"
          value={guestInfo.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          value={guestInfo.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="Email Address"
          value={guestInfo.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <div className="grid grid-cols-[110px_1fr] gap-2">
          <Select
            label="Phone"
            value={guestInfo.phoneCountry}
            onChange={(e) => handleChange("phoneCountry", e.target.value)}
          >
            <option value="IN +91">IN +91</option>
            <option value="US +1">US +1</option>
            <option value="UK +44">UK +44</option>
          </Select>
          <Input
            label="&nbsp;"
            type="tel"
            placeholder="Phone number"
            value={guestInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>
        <Input
          label="City"
          placeholder="City"
          value={guestInfo.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
        <Select
          label="Country of Residence"
          value={guestInfo.country}
          onChange={(e) => handleChange("country", e.target.value)}
        >
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
        </Select>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-brand-blue">
              Message / Special Requests to Property
            </span>
            <textarea
              rows={3}
              value={guestInfo.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
