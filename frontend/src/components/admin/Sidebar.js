"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Rooms (CRUD)", href: "/admin/rooms", icon: BedDouble },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col justify-between bg-trinity-700 text-white">
      <div>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
            T
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              Trinity Suites
            </p>
            <p className="text-xs text-white/60 leading-tight">Admin</p>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-white text-trinity-700 font-medium"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        className="mx-6 mb-6 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
