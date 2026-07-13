import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: {
    default: "Trinity Suites Bangalore | Official Hotel Booking Engine",
    template: "%s | Trinity Suites Bangalore",
  },
  description:
    "Book your stay directly with Trinity Suites Bangalore, boutique serviced suites on MG Road. Instant confirmation, lowest rates, and hassle-free refunds.",
  keywords: [
    "Trinity Suites Bangalore",
    "MG Road hotel",
    "boutique serviced suites Bangalore",
    "hotel booking engine",
  ],
  openGraph: {
    title: "Trinity Suites Bangalore | Official Hotel Booking Engine",
    description:
      "Boutique serviced suites 400 metres from Trinity Circle, MG Road, Bangalore. Book direct and save more.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
