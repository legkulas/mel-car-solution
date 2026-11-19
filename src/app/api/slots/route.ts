/**
 * REST API Route Handler: /api/slots
 * Generates and returns available 1-hour appointment slots for a requested date.
 */

import { NextResponse } from 'next/server';
import { getSupabaseServerAdministrativeClient } from '@/lib/supabase';
import { AppointmentTimeSlot } from '@/types/booking';

interface OccupiedTimeInterval {
  intervalStartDateTime: Date;
  intervalEndDateTime: Date;
}

const DAILY_BUSINESS_OPENING_HOUR: number = 8;  // 8:00 AM
const DAILY_BUSINESS_CLOSING_HOUR: number = 17; // 5:00 PM (17:00)

/**
 * Checks whether a proposed candidate time range intersects with an occupied period.
 */
function doesTimeSlotIntersectOccupiedInterval(
  slotStart: Date,
  slotEnd: Date,
  occupiedInterval: OccupiedTimeInterval
): boolean {
  return (
    slotStart < occupiedInterval.intervalEndDateTime &&
    slotEnd > occupiedInterval.intervalStartDateTime
  );
}

export async function GET(incomingRequest: Request) {
  try {
    const requestUrl = new URL(incomingRequest.url);
    const requestedTargetDate = requestUrl.searchParams.get('date'); // Expected 'YYYY-MM-DD'

    if (!requestedTargetDate) {
      return NextResponse.json(
        { error: 'Query parameter "date" formatted as YYYY-MM-DD is required.' },
        { status: 400 }
      );
    }

    const occupiedTimeIntervalsList: OccupiedTimeInterval[] = [];
    const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const isSupabaseConfigured =
      configuredSupabaseUrl &&
      !configuredSupabaseUrl.includes('your-project') &&
      !configuredSupabaseUrl.includes('placeholder');

    if (isSupabaseConfigured) {
      try {
        const supabaseAdmin = getSupabaseServerAdministrativeClient();
        const startOfDayTimestamp = new Date(`${requestedTargetDate}T00:00:00.000Z`).toISOString();
        const endOfDayTimestamp = new Date(`${requestedTargetDate}T23:59:59.999Z`).toISOString();

        // 1. Fetch confirmed and in-progress appointments
        const { data: existingAppointments, error: appointmentsQueryError } =
          await supabaseAdmin
            .from('appointments')
            .select('start_time, end_time')
            .neq('status', 'cancelled')
            .gte('start_time', startOfDayTimestamp)
            .lte('end_time', endOfDayTimestamp);

        if (appointmentsQueryError) {
          console.error('Error querying scheduled appointments:', appointmentsQueryError);
        } else if (existingAppointments) {
          for (const scheduledAppointment of existingAppointments) {
            occupiedTimeIntervalsList.push({
              intervalStartDateTime: new Date(scheduledAppointment.start_time),
              intervalEndDateTime: new Date(scheduledAppointment.end_time),
            });
          }
        }

        // 2. Fetch mechanic blackout dates/hours
        const { data: blackoutPeriods, error: blackoutQueryError } =
          await supabaseAdmin
            .from('blocked_slots')
            .select('start_time, end_time')
            .gte('start_time', startOfDayTimestamp)
            .lte('end_time', endOfDayTimestamp);

        if (blackoutQueryError) {
          console.error('Error querying blackout slots:', blackoutQueryError);
        } else if (blackoutPeriods) {
          for (const blackout of blackoutPeriods) {
            occupiedTimeIntervalsList.push({
              intervalStartDateTime: new Date(blackout.start_time),
              intervalEndDateTime: new Date(blackout.end_time),
            });
          }
        }
      } catch (databaseQueryException) {
        console.warn(
          'Database slot retrieval failed. Operating in fallback slot mode:',
          databaseQueryException
        );
      }
    }

    // 3. Generate candidate 1-hour time slots
    const generatedSlotsList: AppointmentTimeSlot[] = [];
    const currentEpochTimestamp = Date.now();

    const timeLabelFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    for (
      let currentHour = DAILY_BUSINESS_OPENING_HOUR;
      currentHour < DAILY_BUSINESS_CLOSING_HOUR;
      currentHour++
    ) {
      const slotStartDateTime = new Date(
        `${requestedTargetDate}T${String(currentHour).padStart(2, '0')}:00:00`
      );
      const slotEndDateTime = new Date(
        slotStartDateTime.getTime() + 60 * 60 * 1000
      );

      const hasSchedulingConflict = occupiedTimeIntervalsList.some(
        (occupiedInterval) =>
          doesTimeSlotIntersectOccupiedInterval(
            slotStartDateTime,
            slotEndDateTime,
            occupiedInterval
          )
      );

      const isFutureSlot = slotStartDateTime.getTime() > currentEpochTimestamp;
      const isSlotAvailableForBooking = !hasSchedulingConflict && isFutureSlot;

      const formattedDisplayLabel = `${timeLabelFormatter.format(
        slotStartDateTime
      )} - ${timeLabelFormatter.format(slotEndDateTime)}`;

      generatedSlotsList.push({
        startDateTimeIso: slotStartDateTime.toISOString(),
        endDateTimeIso: slotEndDateTime.toISOString(),
        formattedDisplayLabel,
        isAvailableForBooking: isSlotAvailableForBooking,
      });
    }

    return NextResponse.json({ slots: generatedSlotsList });
  } catch (handlerException: unknown) {
    console.error('Unhandled exception in /api/slots route:', handlerException);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while calculating time slots.' },
      { status: 500 }
    );
  }
}
