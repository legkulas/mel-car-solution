'use client';

/**
 * Mechanic Dashboard Page
 * Provides the workshop mechanic with a real-time daily agenda,
 * status lifecycle transitions, customer contact triggers, and bay allocation metrics.
 * Built strictly according to W3C semantic markup and WCAG AA accessibility standards.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Phone,
  CheckCircle,
  PlayCircle,
  XCircle,
  ChevronLeft,
} from 'lucide-react';
import { AppointmentLifecycleStatus } from '@/types/booking';

interface DashboardAppointmentItem {
  appointmentId: string;
  formattedTimeWindow: string;
  customerFullName: string;
  customerPhoneNumber: string;
  vehicleDescription: string;
  vehicleLicensePlate: string;
  requestedServiceName: string;
  currentStatus: AppointmentLifecycleStatus;
  customerSymptomNotes?: string;
}

const INITIAL_SCHEDULED_APPOINTMENTS: DashboardAppointmentItem[] = [
  {
    appointmentId: 'appt-001',
    formattedTimeWindow: '08:00 AM - 09:00 AM',
    customerFullName: 'Marcus Vance',
    customerPhoneNumber: '(555) 234-8901',
    vehicleDescription: '2019 Honda Civic',
    vehicleLicensePlate: '7ABC123',
    requestedServiceName: 'Synthetic Oil & Filter Change',
    currentStatus: 'completed',
    customerSymptomNotes: 'Customer requested top-off of windshield washer fluid.',
  },
  {
    appointmentId: 'appt-002',
    formattedTimeWindow: '09:00 AM - 10:30 AM',
    customerFullName: 'Sarah Jenkins',
    customerPhoneNumber: '(555) 890-1234',
    vehicleDescription: '2021 Toyota RAV4',
    vehicleLicensePlate: '8XYZ456',
    requestedServiceName: 'Brake Inspection & Pad Replacement',
    currentStatus: 'in_progress',
    customerSymptomNotes:
      'High-pitched squeal from front passenger wheel during slow deceleration.',
  },
  {
    appointmentId: 'appt-003',
    formattedTimeWindow: '11:00 AM - 12:00 PM',
    customerFullName: 'David Lee',
    customerPhoneNumber: '(555) 456-7890',
    vehicleDescription: '2018 Ford F-150',
    vehicleLicensePlate: 'TRK-990',
    requestedServiceName: 'General Diagnostics & Check Engine',
    currentStatus: 'confirmed',
    customerSymptomNotes:
      'Check engine light illuminated after cold start. Engine idles rough at red lights.',
  },
  {
    appointmentId: 'appt-004',
    formattedTimeWindow: '01:00 PM - 01:45 PM',
    customerFullName: 'Elena Rostova',
    customerPhoneNumber: '(555) 789-0123',
    vehicleDescription: '2020 Subaru Outback',
    vehicleLicensePlate: '4MNP888',
    requestedServiceName: 'Tire Rotation & High-Speed Balancing',
    currentStatus: 'confirmed',
  },
];

type StatusFilterOption = 'all' | AppointmentLifecycleStatus;

export default function MechanicDashboard() {
  const [scheduledAppointments, setScheduledAppointments] = useState<
    DashboardAppointmentItem[]
  >(INITIAL_SCHEDULED_APPOINTMENTS);

  const [activeFilterTab, setActiveFilterTab] =
    useState<StatusFilterOption>('all');

  const handleUpdateAppointmentStatus = (
    targetAppointmentId: string,
    newStatus: AppointmentLifecycleStatus
  ) => {
    setScheduledAppointments((previousAppointments) =>
      previousAppointments.map((appointment) =>
        appointment.appointmentId === targetAppointmentId
          ? { ...appointment, currentStatus: newStatus }
          : appointment
      )
    );
  };

  const filteredAppointmentsList = scheduledAppointments.filter(
    (appointment) => {
      if (activeFilterTab === 'all') return true;
      return appointment.currentStatus === activeFilterTab;
    }
  );

  function renderStatusBadge(status: AppointmentLifecycleStatus) {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <PlayCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Active In Bay</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Confirmed Slot</span>
          </span>
        );
    }
  }

  const currentDateDisplayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-12">
      {/* Dashboard Header Banner */}
      <header role="banner" className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Navigate back to Customer Booking View"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </Link>

            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 bg-black shrink-0">
              <Image
                src="/logo.jpg"
                alt="Mel Gives Car Solution emblem"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                Mel&apos;s Workshop Dashboard
              </h1>
              <p className="text-[11px] text-gray-500">Bay Schedule & Queue Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
              Today: {currentDateDisplayString}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Daily Bay Metrics Section */}
        <section aria-labelledby="daily-metrics-heading">
          <h2 id="daily-metrics-heading" className="sr-only">
            Daily Service Bay Metrics
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium">Total Booked</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {scheduledAppointments.length}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-emerald-600 font-medium">Completed</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {
                  scheduledAppointments.filter(
                    (item) => item.currentStatus === 'completed'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-blue-600 font-medium">Active in Bay</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {
                  scheduledAppointments.filter(
                    (item) => item.currentStatus === 'in_progress'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-amber-600 font-medium">Upcoming Queue</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {
                  scheduledAppointments.filter(
                    (item) => item.currentStatus === 'confirmed'
                  ).length
                }
              </p>
            </div>
          </div>
        </section>

        {/* Toolbar & Filter Tabs */}
        <section aria-label="Appointment queue filters" className="flex items-center justify-between gap-3 flex-wrap">
          <div
            role="tablist"
            aria-label="Filter appointments by workflow status"
            className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 text-xs"
          >
            {(['all', 'confirmed', 'in_progress', 'completed'] as const).map(
              (filterTabIdentifier) => {
                const isTabActive = activeFilterTab === filterTabIdentifier;
                const tabDisplayLabel = filterTabIdentifier.replace('_', ' ');

                return (
                  <button
                    key={filterTabIdentifier}
                    role="tab"
                    type="button"
                    aria-selected={isTabActive}
                    onClick={() => setActiveFilterTab(filterTabIdentifier)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isTabActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tabDisplayLabel}
                  </button>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                'To reserve a bay blackout interval, insert a row in the blocked_slots database table or use the blackout dialogue.'
              )
            }
            className="text-xs font-semibold px-3.5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
          >
            + Block Out Bay Time
          </button>
        </section>

        {/* Chronological Daily Agenda */}
        <section aria-labelledby="daily-agenda-heading" className="space-y-3">
          <h2 id="daily-agenda-heading" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Today&apos;s Bay Schedule
          </h2>

          {filteredAppointmentsList.length === 0 ? (
            <div
              role="status"
              className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 text-sm"
            >
              No appointments found matching this status filter.
            </div>
          ) : (
            filteredAppointmentsList.map((appointmentItem) => {
              const appointmentHeadingId = `appointment-heading-${appointmentItem.appointmentId}`;

              return (
                <article
                  key={appointmentItem.appointmentId}
                  aria-labelledby={appointmentHeadingId}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4 hover:border-gray-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
                      <h3
                        id={appointmentHeadingId}
                        className="font-bold text-gray-900 text-sm sm:text-base"
                      >
                        {appointmentItem.formattedTimeWindow}
                      </h3>
                    </div>
                    <div>{renderStatusBadge(appointmentItem.currentStatus)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 block uppercase">
                        Customer
                      </span>
                      <p className="font-bold text-gray-900 mt-0.5">
                        {appointmentItem.customerFullName}
                      </p>
                      <a
                        href={`tel:${appointmentItem.customerPhoneNumber}`}
                        aria-label={`Call customer ${appointmentItem.customerFullName} at ${appointmentItem.customerPhoneNumber}`}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-1 font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                      >
                        <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{appointmentItem.customerPhoneNumber}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-400 block uppercase">
                        Vehicle Specification
                      </span>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {appointmentItem.vehicleDescription}
                      </p>
                      <span className="inline-block mt-1 font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                        {appointmentItem.vehicleLicensePlate}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-400 block uppercase">
                        Service Scope
                      </span>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {appointmentItem.requestedServiceName}
                      </p>
                    </div>
                  </div>

                  {appointmentItem.customerSymptomNotes && (
                    <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900">
                      <strong>Customer Notes & Symptoms:</strong>{' '}
                      {appointmentItem.customerSymptomNotes}
                    </div>
                  )}

                  {/* Workflow Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    {appointmentItem.currentStatus !== 'in_progress' &&
                      appointmentItem.currentStatus !== 'completed' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateAppointmentStatus(
                              appointmentItem.appointmentId,
                              'in_progress'
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          Pull Into Bay / Start Service
                        </button>
                      )}

                    {appointmentItem.currentStatus !== 'completed' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateAppointmentStatus(
                            appointmentItem.appointmentId,
                            'completed'
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                      >
                        Mark Service Complete
                      </button>
                    )}

                    {appointmentItem.currentStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateAppointmentStatus(
                            appointmentItem.appointmentId,
                            'cancelled'
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
