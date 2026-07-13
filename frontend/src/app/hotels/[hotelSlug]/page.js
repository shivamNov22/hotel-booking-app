import BookingFlow from "@/components/booking/BookingFlow";
import { mockHotel } from "@/data/mockHotel";

export async function generateMetadata({ params }) {
  const { hotelSlug } = await params;
  const hotel = hotelSlug === mockHotel.slug ? mockHotel : null;

  if (!hotel) {
    return { title: "Hotel not found" };
  }

  return {
    title: `${hotel.name} | Book Direct & Save`,
    description: hotel.propertyInfo[0],
    alternates: {
      canonical: `/hotels/${hotel.slug}`,
    },
    openGraph: {
      title: hotel.name,
      description: hotel.propertyInfo[0],
      images: hotel.images.slice(0, 1),
    },
  };
}

export function generateStaticParams() {
  return [{ hotelSlug: mockHotel.slug }];
}

export default async function HotelBookingPage({ params }) {
  const { hotelSlug } = await params;
  return <BookingFlow slug={hotelSlug} />;
}
