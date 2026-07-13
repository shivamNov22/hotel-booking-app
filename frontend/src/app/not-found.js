import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-brand-blue underline">
        Go back home
      </Link>
    </div>
  );
}
