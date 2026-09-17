"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center px-100 py-40 text-center"
        style={{
          backgroundImage: "url('/img/salon.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-pink-300">
            Welcome to Our Salon
          </p>

          <h1 className="mb-6 text-5xl font-bold md:text-7xl">
            Look Good.
            <br />
            Feel Good.
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
            Relax, refresh, and enjoy professional beauty services from our
            experienced salon team.
          </p>

          <a
            href="/appointments"
            className="inline-block rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Book an Appointment
          </a>
        </div>
      </section>
    </main>
  );
}