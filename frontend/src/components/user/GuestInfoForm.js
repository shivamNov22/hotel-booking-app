export default function GuestInfoForm({ guestInfo, onChange }) {
  const update = (field) => (e) => onChange({ ...guestInfo, [field]: e.target.value });

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <h2 className="bg-trinity-700 px-5 py-3 text-sm font-semibold text-white">Guest Information</h2>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <input
          required
          value={guestInfo.firstName}
          onChange={update("firstName")}
          placeholder="First Name"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        />
        <input
          required
          value={guestInfo.lastName}
          onChange={update("lastName")}
          placeholder="Last Name"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        />
        <input
          required
          type="email"
          value={guestInfo.email}
          onChange={update("email")}
          placeholder="Email Address"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <select
            value={guestInfo.countryCode}
            onChange={update("countryCode")}
            className="w-24 rounded-lg border border-black/10 px-2 py-2 text-sm focus:border-trinity-500 focus:outline-none"
          >
            <option value="+91">IN +91</option>
            <option value="+1">US +1</option>
            <option value="+44">UK +44</option>
          </select>
          <input
            required
            value={guestInfo.phone}
            onChange={update("phone")}
            placeholder="Phone number"
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
          />
        </div>
        <input
          value={guestInfo.city}
          onChange={update("city")}
          placeholder="City"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        />
        <select
          value={guestInfo.country}
          onChange={update("country")}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        >
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          value={guestInfo.specialRequest}
          onChange={update("specialRequest")}
          placeholder="Message / Special Requests to Property"
          rows={3}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none sm:col-span-2"
        />
      </div>
    </div>
  );
}
