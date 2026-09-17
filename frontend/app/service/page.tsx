"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: number;
  name: string;
  price: string;
  time: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// Helper to format "00:01:00" -> "1 hr" or "30 mins"
function formatDuration(time: string): string {
  if (!time) return "";
  const parts = time.split(":").map(Number);
  const [hours, minutes] = parts;

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} mins`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${minutes} mins`;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_URL}/api/services/`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data: Service[] = await res.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-pink-600 px-6 py-20 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-100">
          What We Offer
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">Our Services</h1>

        <p className="mx-auto mt-5 max-w-2xl text-pink-100">
          Discover our professional beauty and salon services designed to
          help you relax, refresh, and feel your best.
        </p>
      </section>

      {/* Services */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500">Error: {error}</p>
          )}

          {/* Empty */}
          {!loading && !error && services.length === 0 && (
            <p className="text-center text-gray-500">
              No services available at the moment.
            </p>
          )}

          {/* Grid */}
          {!loading && !error && services.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                    {service.name}
                  </h2>

                  <p className="mb-4 text-sm text-gray-500">
                    ⏱ {formatDuration(service.time)}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-semibold text-pink-600">
                      Rs {parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/appointment?service=${service.id}`}
                    className="mt-5 block w-full rounded-lg bg-pink-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-pink-700"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}