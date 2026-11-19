'use client';

/**
 * BookingSlotPicker Component
 * Renders available 1-hour appointment slots for a specified calendar date.
 * Complies with W3C WAI-ARIA standards for interactive state and focus management.
 */

import React, { useState, useEffect } from 'react';
import { AppointmentTimeSlot } from '@/types/booking';
import { Clock, AlertCircle } from 'lucide-react';

interface BookingSlotPickerProps {
  selectedCalendarDate: string; // Formatted 'YYYY-MM-DD'
  selectedSlotStartTimeIso: string | null;
  onSlotSelected: (chosenTimeSlot: AppointmentTimeSlot) => void;
}

export default function BookingSlotPicker({
  selectedCalendarDate,
  selectedSlotStartTimeIso,
  onSlotSelected,
}: BookingSlotPickerProps) {
  const [retrievedTimeSlots, setRetrievedTimeSlots] = useState<AppointmentTimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState<boolean>(true);
  const [slotRetrievalErrorMessage, setSlotRetrievalErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isRequestMounted = true;

    async function fetchAvailableTimeSlotsForDate() {
      setIsLoadingTimeSlots(true);
      setSlotRetrievalErrorMessage(null);

      try {
        const apiResponse = await fetch(
          `/api/slots?date=${encodeURIComponent(selectedCalendarDate)}`
        );

        if (!apiResponse.ok) {
          throw new Error('Unable to retrieve available appointments for the selected date.');
        }

        const responsePayload = await apiResponse.json();

        if (isRequestMounted) {
          setRetrievedTimeSlots(responsePayload.slots || []);
        }
      } catch (errorInstance: unknown) {
        if (isRequestMounted) {
          const userFacingErrorText =
            errorInstance instanceof Error
              ? errorInstance.message
              : 'An error occurred while loading available time slots.';
          setSlotRetrievalErrorMessage(userFacingErrorText);
        }
      } finally {
        if (isRequestMounted) {
          setIsLoadingTimeSlots(false);
        }
      }
    }

    if (selectedCalendarDate) {
      fetchAvailableTimeSlotsForDate();
    }

    return () => {
      isRequestMounted = false;
    };
  }, [selectedCalendarDate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span>Available 1-Hour Windows</span>
        </h3>
        <span className="text-xs text-gray-500 font-medium">Date: {selectedCalendarDate}</span>
      </div>

      {isLoadingTimeSlots && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
        >
          <span className="sr-only">Loading available time slots for {selectedCalendarDate}...</span>
          {[...Array(6)].map((_, placeholderIndex) => (
            <div
              key={placeholderIndex}
              className="h-12 bg-gray-100 animate-pulse rounded-xl"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {slotRetrievalErrorMessage && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{slotRetrievalErrorMessage}</span>
        </div>
      )}

      {!isLoadingTimeSlots && !slotRetrievalErrorMessage && retrievedTimeSlots.length === 0 && (
        <p className="text-sm text-gray-500 py-3" role="status">
          No appointment slots are open for this date. Please choose another day.
        </p>
      )}

      {!isLoadingTimeSlots && !slotRetrievalErrorMessage && retrievedTimeSlots.length > 0 && (
        <div
          role="group"
          aria-label={`Time slots for ${selectedCalendarDate}`}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
        >
          {retrievedTimeSlots.map((candidateSlot) => {
            const isSlotActiveAndSelected =
              selectedSlotStartTimeIso === candidateSlot.startDateTimeIso;

            const slotAccessibilityStatusText = candidateSlot.isAvailableForBooking
              ? isSlotActiveAndSelected
                ? 'Selected time slot'
                : 'Available time slot'
              : 'Unavailable time slot, already booked';

            return (
              <button
                key={candidateSlot.startDateTimeIso}
                type="button"
                disabled={!candidateSlot.isAvailableForBooking}
                aria-pressed={isSlotActiveAndSelected}
                aria-label={`${candidateSlot.formattedDisplayLabel}: ${slotAccessibilityStatusText}`}
                onClick={() => onSlotSelected(candidateSlot)}
                className={`py-3 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all duration-150 flex items-center justify-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  !candidateSlot.isAvailableForBooking
                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed line-through'
                    : isSlotActiveAndSelected
                    ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-md shadow-blue-200'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:text-blue-600 shadow-2xs'
                }`}
              >
                {candidateSlot.formattedDisplayLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
