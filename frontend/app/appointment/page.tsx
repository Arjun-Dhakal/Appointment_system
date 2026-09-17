"use client";

import { useEffect, useState, FormEvent } from "react";

type Service = {
  id: number;
  name: string;
  price: string;
  time: string;
};

type Appointment = {
  id: number;
  customer_name: string;
  customer_phone: string;
  service: number;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// Turn DRF error JSON into a single readable message
function extractApiError(errData: any): string {
  if (!errData) return "Something went wrong";
  if (typeof errData === "string") return errData;
  if (Array.isArray(errData)) return errData.join(" ");

  // { non_field_errors: ["..."] }
  if (errData.non_field_errors) {
    return Array.isArray(errData.non_field_errors)
      ? errData.non_field_errors[0]
      : errData.non_field_errors;
  }

  // Field errors: { field: ["msg"] }
  const firstKey = Object.keys(errData)[0];
  const value = errData[firstKey];
  return Array.isArray(value) ? value[0] : String(value);
}

export default function AppointmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    service: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  // Load services on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/services/`);
        if (!res.ok) throw new Error("Failed to load services");
        setServices(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Clear error/success as soon as the user edits any field
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [
    form.customer_name,
    form.customer_phone,
    form.service,
    form.appointment_date,
    form.appointment_time,
    form.notes,
  ]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_URL}/api/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          service: Number(form.service),
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(extractApiError(errData));
      }

      await res.json(); // consume the created Appointment (not used in UI)
      setSuccess("Appointment booked successfully!");
      setForm({
        customer_name: "",
        customer_phone: "",
        service: "",
        appointment_date: "",
        appointment_time: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-pink-600 px-6 py-16 text-center text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-100">
          Book With Us
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">Book an Appointment</h1>
        <p className="mx-auto mt-5 max-w-2xl text-pink-100">
          Reserve your spot in seconds. We'll confirm your booking shortly.
        </p>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-8 shadow-sm"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Your Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => update("customer_name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g. Sita Sharma"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.customer_phone}
                  onChange={(e) => update("customer_phone", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="98XXXXXXXX"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Service *
                </label>
                <select
                  required
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {loading ? "Loading services..." : "Select a service"}
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Rs {parseFloat(s.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.appointment_date}
                    onChange={(e) =>
                      update("appointment_date", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.appointment_time}
                    onChange={(e) =>
                      update("appointment_time", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Any special requests?"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}