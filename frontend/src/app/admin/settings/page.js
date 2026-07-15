import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  LifeBuoy,
  HelpCircle,
  ShieldCheck,
  FileText,
  Info,
  ChevronRight,
} from "lucide-react";
import Topbar from "@/components/admin/Topbar";

// Fully static settings page — no backend integration, no forms, no save
// buttons. Values below are placeholders until real content is supplied.
const CUSTOMER_SUPPORT = [
  { icon: Phone, label: "Customer Care Number", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MessageCircle, label: "WhatsApp Number", value: "+91 98765 43210", href: "https://wa.me/919876543210" },
  { icon: Mail, label: "Support Email", value: "support@trinitysuites.com", href: "mailto:support@trinitysuites.com" },
  { icon: MapPin, label: "Office Address", value: "12 MG Road, Bengaluru, Karnataka 560001" },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat, 9:00 AM – 7:00 PM IST" },
];

const HELP_INFO = [
  { icon: LifeBuoy, label: "Contact Support" },
  { icon: HelpCircle, label: "FAQ" },
  { icon: ShieldCheck, label: "Privacy Policy" },
  { icon: FileText, label: "Terms & Conditions" },
  { icon: Info, label: "App Version", value: "1.0.0", static: true },
];

export default function SettingsPage() {
  return (
    <div className="pb-10">
      <Topbar title="Settings" />

      <div className="grid grid-cols-1 gap-6 px-8 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-trinity-900">Customer Support</h2>
          <div className="space-y-3">
            {CUSTOMER_SUPPORT.map(({ icon: Icon, label, value, href }) => {
              const row = (
                <div className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-trinity-600">
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-trinity-900/50">{label}</p>
                    <p className="truncate text-sm font-medium text-trinity-900">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:opacity-90">
                  {row}
                </a>
              ) : (
                <div key={label}>{row}</div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-trinity-900">Help &amp; Information</h2>
          <div className="divide-y divide-black/5">
            {HELP_INFO.map(({ icon: Icon, label, value, static: isStatic }) =>
              isStatic ? (
                <div key={label} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
                      <Icon size={17} />
                    </span>
                    <p className="text-sm text-trinity-900">{label}</p>
                  </div>
                  <p className="text-sm text-trinity-900/50">{value}</p>
                </div>
              ) : (
                <a
                  key={label}
                  href="#"
                  className="flex items-center justify-between py-3 text-trinity-900 hover:text-trinity-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
                      <Icon size={17} />
                    </span>
                    <p className="text-sm">{label}</p>
                  </div>
                  <ChevronRight size={16} className="text-trinity-900/30" />
                </a>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
