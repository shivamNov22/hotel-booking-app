"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";

export default function Topbar({ title }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <h1 className="text-2xl font-semibold text-trinity-900">{title}</h1>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm hover:shadow transition-shadow"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-trinity-100 text-trinity-700">
            <User size={16} />
          </span>
          <span className="text-sm text-trinity-900">Welcome, Admin</span>
          <ChevronDown size={16} className="text-trinity-700" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-black/5 bg-white py-1 shadow-lg">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-trinity-900 hover:bg-cream"
              onClick={() => {
                // TODO: link to real profile/settings page once built
                setOpen(false);
              }}
            >
              My Profile
            </button>

            <Link
              href="/"
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-cream"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
