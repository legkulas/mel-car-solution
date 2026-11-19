'use server';

/**
 * Server Action for Processing Customer Appointment Bookings
 * Coordinates customer records, vehicle assignment, and slot concurrency verification.
 */

import { getSupabaseServerAdministrativeClient } from '@/lib/supabase';
import {
  AppointmentBookingPayload,
  BookingCreationResult,
} from '@/types/booking';

/**
 * Validates and commits a customer appointment reservation to the database.
 * Employs PostgreSQL exclusion constraints to guarantee zero double-bookings.
 */
export async function submitCustomerAppointmentBooking(
  bookingPayload: AppointmentBookingPayload
): Promise<BookingCreationResult> {
  try {
    const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Graceful offline/local development fallback when credentials are not yet configured
    const isRunningInDemonstrationMode =
      !configuredSupabaseUrl ||
      configuredSupabaseUrl.includes('your-project') ||
      configuredSupabaseUrl.includes('placeholder');

    if (isRunningInDemonstrationMode) {
      console.info(
        '[Development Mode] Simulating appointment creation for:',
        bookingPayload.customerContact.customerFullName
      );
      // Brief simulated processing delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const simulatedReferenceId =
        'MEL-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      return {
        isSuccess: true,
        appointmentReferenceId: simulatedReferenceId,
      };
    }

    const supabaseAdmin = getSupabaseServerAdministrativeClient();

    // 1. Retrieve or register the customer in the database
    let customerDatabaseId: string | null = null;

    const { data: existingCustomerRecord, error: customerLookupError } =
      await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', bookingPayload.customerContact.customerEmailAddress)
        .maybeSingle();

    if (customerLookupError) {
      console.error('Customer lookup query error:', customerLookupError);
    }

    if (existingCustomerRecord) {
      customerDatabaseId = existingCustomerRecord.id;
    } else {
      const {
        data: createdCustomerRecord,
        error: customerRegistrationError,
      } = await supabaseAdmin
        .from('customers')
        .insert({
          full_name: bookingPayload.customerContact.customerFullName,
          email: bookingPayload.customerContact.customerEmailAddress,
          phone: bookingPayload.customerContact.customerPhoneNumber,
        })
        .select('id')
        .single();

      if (customerRegistrationError) {
        throw new Error(
          `Failed to register customer: ${customerRegistrationError.message}`
        );
      }
      customerDatabaseId = createdCustomerRecord.id;
    }

    // 2. Insert the vehicle record associated with this customer
    const { data: registeredVehicleRecord, error: vehicleRegistrationError } =
      await supabaseAdmin
        .from('vehicles')
        .insert({
          customer_id: customerDatabaseId,
          year: bookingPayload.customerVehicle.modelYear,
          make: bookingPayload.customerVehicle.manufacturerMake,
          model: bookingPayload.customerVehicle.modelName,
          license_plate:
            bookingPayload.customerVehicle.licensePlateNumber?.trim() || null,
        })
        .select('id')
        .single();

    if (vehicleRegistrationError) {
      throw new Error(
        `Failed to register vehicle: ${vehicleRegistrationError.message}`
      );
    }

    // 3. Atomically book the appointment
    const {
      data: createdAppointmentRecord,
      error: appointmentCreationError,
    } = await supabaseAdmin
      .from('appointments')
      .insert({
        customer_id: customerDatabaseId,
        vehicle_id: registeredVehicleRecord.id,
        service_id: bookingPayload.selectedServiceId,
        start_time: bookingPayload.appointmentStartDateTimeIso,
        end_time: bookingPayload.appointmentEndDateTimeIso,
        customer_notes:
          bookingPayload.customerAdditionalNotes?.trim() || null,
        status: 'confirmed',
      })
      .select('id')
      .single();

    if (appointmentCreationError) {
      // PostgreSQL error code '23P01' designates an exclusion_violation (overlapping time range)
      if (appointmentCreationError.code === '23P01') {
        return {
          isSuccess: false,
          userFacingErrorMessage:
            'This appointment time slot was just claimed by another customer. Please choose a different available slot.',
        };
      }

      throw new Error(
        `Database appointment creation rejected: ${appointmentCreationError.message}`
      );
    }

    return {
      isSuccess: true,
      appointmentReferenceId: createdAppointmentRecord.id,
    };
  } catch (unexpectedError: unknown) {
    const errorDetailsMessage =
      unexpectedError instanceof Error
        ? unexpectedError.message
        : 'An unexpected error occurred.';
    console.error('Critical failure in submitCustomerAppointmentBooking:', unexpectedError);
    return {
      isSuccess: false,
      userFacingErrorMessage:
        errorDetailsMessage ||
        'We encountered an unexpected issue while saving your booking. Please try again.',
    };
  }
}
