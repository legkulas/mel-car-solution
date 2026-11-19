import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BookingWizard from '@/components/customer/BookingWizard';
import {
  ShieldCheck,
  Clock,
  Wrench,
  Star,
  MapPin,
  Phone,
  LayoutDashboard,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-gray-100 text-gray-900 flex flex-col justify-between font-sans">
      {/* Top Banner & Navigation */}
      <header role="banner" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 bg-black shrink-0">
              <Image
                src="/logo.jpg"
                alt="Mel Gives Car Solution shop emblem"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-base sm:text-lg">
              Mel Gives Car Solution
            </span>
          </div>

          <nav aria-label="Main site navigation" className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="tel:5550192834"
              className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition"
              aria-label="Call Mel Gives Car Solution at 555-019-2834"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span>(555) 019-2834</span>
            </a>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
              <span>Mechanic Login</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1">
        {/* Hero Section */}
        <section aria-labelledby="hero-main-heading" className="pt-8 pb-4 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" aria-hidden="true" />
            <span>Certified Automotive Repair & Maintenance</span>
          </div>
          <h1
            id="hero-main-heading"
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Book Your Auto Service in 60 Seconds
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mt-2">
            Transparent pricing estimates, no upfront credit card required, and dedicated 1-hour shop bays.
          </p>
        </section>

        {/* Customer Interactive Booking Flow */}
        <section aria-label="Appointment reservation tool" className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-4 mb-8">
          <BookingWizard />
        </section>

        {/* Guarantees & Trust Factors */}
        <section
          aria-labelledby="workshop-guarantees-heading"
          className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200/80"
        >
          <h2 id="workshop-guarantees-heading" className="sr-only">
            Workshop Guarantees and Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2"
                aria-hidden="true"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Certified Master Technicians</h3>
              <p className="text-xs text-gray-500 mt-1">
                Servicing according to OEM manufacturer specifications and parts.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2"
                aria-hidden="true"
              >
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Strict Zero Double-Booking</h3>
              <p className="text-xs text-gray-500 mt-1">
                Dedicated service bay allocated solely for your reserved time.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2"
                aria-hidden="true"
              >
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Upfront Honest Pricing</h3>
              <p className="text-xs text-gray-500 mt-1">
                Pay in-shop only after your vehicle has been serviced and inspected.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Landmark with Contact and Address */}
      <footer role="contentinfo" className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <address className="flex items-center gap-1.5 not-italic text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <span>Mel Gives Car Solution Workshop · Operating Hours: Mon–Sat 8:00 AM – 5:00 PM</span>
          </address>
          <p>© {new Date().getFullYear()} Mel Gives Car Solution. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
