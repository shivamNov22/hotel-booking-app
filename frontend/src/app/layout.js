import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "Trinity Suites — Admin",
  description: "Trinity Suites hotel admin panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans text-trinity-900 antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
