export default function Footer() {
  return (
    <footer className="mt-10 bg-brand-navyDark py-6 text-center text-sm text-slate-300">
      <p>
        &copy; {new Date().getFullYear()} All rights reserved. Hotel Booking
        Engine - Powered by{" "}
        <a href="#" className="text-white underline underline-offset-2">
          eglobe-solutions.com
        </a>
      </p>
    </footer>
  );
}
