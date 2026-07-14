import Topbar from "@/components/admin/Topbar";

export default function BookingsPage() {
  return (
    <div>
      <Topbar title="Bookings Management" />
      <div className="mx-8 rounded-2xl bg-white p-10 text-center shadow-sm">
        <p className="text-trinity-900/60">
          This page will list and manage all bookings once{" "}
          <code className="rounded bg-cream px-1.5 py-0.5">GET /api/admin/bookings</code> is built on the
          backend. Coming in the next step.
        </p>
      </div>
    </div>
  );
}
