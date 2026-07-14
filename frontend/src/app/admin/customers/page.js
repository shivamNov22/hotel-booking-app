import Topbar from "@/components/admin/Topbar";

export default function CustomersPage() {
  return (
    <div>
      <Topbar title="Customer Management" />
      <div className="mx-8 rounded-2xl bg-white p-10 text-center shadow-sm">
        <p className="text-trinity-900/60">
          This page will list all customers once{" "}
          <code className="rounded bg-cream px-1.5 py-0.5">GET /api/admin/customers</code> is built on the
          backend. Coming in the next step.
        </p>
      </div>
    </div>
  );
}
