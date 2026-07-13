import { redirect } from "next/navigation";
import { mockHotel } from "@/data/mockHotel";

function defaultCheckIn() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  const dd = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${dd}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

export default function RootPage() {
  redirect(
    `/hotels/${mockHotel.slug}?checkIn=${defaultCheckIn()}&nights=1#bookingsteps`
  );
}
