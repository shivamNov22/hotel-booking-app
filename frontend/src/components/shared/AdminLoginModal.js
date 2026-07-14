"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldAlert } from "lucide-react";
import { useAdminLoginMutation } from "@/redux/api/authApi";

export default function AdminLoginModal({ open, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await adminLogin({ email, password }).unwrap();
      onClose();
      router.push("/admin/dashboard");
    } catch (err) {
      // The backend's admin-login endpoint returns a generic "Invalid email
      // or password" for both a wrong password AND a non-admin account (it
      // only ever checks the Admin collection) — we translate that into a
      // clearer, friendlier message here rather than changing backend wording.
      if (err?.status === 401) {
        setError("Invalid admin credentials. You are not authorized to access the Admin Panel.");
      } else {
        setError(err?.data?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-trinity-900">Admin Login</h3>
          <button type="button" onClick={onClose} className="text-trinity-900/50 hover:text-trinity-900">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-trinity-500 py-2.5 text-sm font-medium text-white hover:bg-trinity-600 disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
