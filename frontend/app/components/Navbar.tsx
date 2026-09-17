"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo / Website Name */}
        <Link
          href="/"
          className="text-xl font-bold text-pink-600"
        >
          Appointment Booking
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 transition hover:text-pink-600"
          >
            Home
          </Link>

          <Link
            href="/service"
            className="text-gray-700 transition hover:text-pink-600"
          >
            Services
          </Link>

          <Link
            href="/appointment"
            className="text-gray-700 transition hover:text-pink-600"
          >
            Appointments
          </Link>
        </div>

      </div>
    </nav>
  );
}

