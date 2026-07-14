import { Building2, Coffee, UserRound, Wifi, Shirt, Plane, ImageOff } from "lucide-react";

const FACILITIES = [
  { label: "Banquet", icon: Building2 },
  { label: "Complimentary Breakfast", icon: Coffee },
  { label: "Front Desk", icon: UserRound },
  { label: "Internet", icon: Wifi },
  { label: "Laundry", icon: Shirt },
  { label: "Travel Desk", icon: Plane },
];

export default function PropertyTabsContent({ activeTab }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Static content — none of these tabs have a backend data source yet.
          Property Info: add a `description` field to a Property/Settings model.
          Photo Gallery: add an `images: [String]` field (see also the note in
          RoomCard.js about Room.image being a single URL, not an array).
          Facilities: could reuse the same amenities pattern as Room, at the
          property level instead of per-room.
          Location: swap the placeholder query below for the real address/lat-lng. */}
      {activeTab === "Property Info" && (
        <div className="space-y-3 text-sm text-trinity-900/70">
          <p>
            Trinity Suites is a boutique serviced-suites property, blending boutique-hotel styling with the
            comfort and space of a serviced apartment — thoughtfully furnished rooms with full-service amenities
            in a relaxed, personal setting.
          </p>
          <p>
            Centrally located in Bangalore, it's close to major corporate hubs and a short distance from the
            city's popular shopping and dining districts.
          </p>
        </div>
      )}

      {activeTab === "Photo Gallery" && (
        <div className="flex flex-col items-center gap-2 py-10 text-trinity-900/40">
          <ImageOff size={28} />
          <p className="text-sm">Photo gallery coming soon.</p>
        </div>
      )}

      {activeTab === "Facilities" && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {FACILITIES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
                <Icon size={20} />
              </span>
              <p className="text-xs text-trinity-900/70">{label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Location" && (
        <div className="overflow-hidden rounded-xl">
          <iframe
            title="Property location"
            src="https://maps.google.com/maps?q=Bangalore%2C%20Karnataka%2C%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="h-80 w-full border-0"
            loading="lazy"
          />
          <p className="mt-2 text-xs text-trinity-900/40">
            Placeholder map — set the property&apos;s real address once available.
          </p>
        </div>
      )}
    </div>
  );
}
