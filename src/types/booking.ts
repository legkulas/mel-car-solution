/**
 * Mel Gives Car Solution - Domain Type Definitions
 * All interfaces and types are strictly typed with descriptive names adhering to domain terminology.
 */

/** Represents an automotive service provided by the workshop */
export interface AutomotiveService {
  id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  estimatedPriceInDollars: number;
  isActive: boolean;
}

/** Represents a 1-hour appointment window */
export interface AppointmentTimeSlot {
  startDateTimeIso: string;
  endDateTimeIso: string;
  formattedDisplayLabel: string;
  isAvailableForBooking: boolean;
}

/** Customer contact details submitted during booking */
export interface CustomerContactInformation {
  customerFullName: string;
  customerEmailAddress: string;
  customerPhoneNumber: string;
}

/** Vehicle details for the booked service */
export interface CustomerVehicleInformation {
  modelYear: number;
  manufacturerMake: string;
  modelName: string;
  licensePlateNumber?: string;
}

/** Complete booking payload submitted to the server */
export interface AppointmentBookingPayload {
  selectedServiceId: string;
  appointmentStartDateTimeIso: string;
  appointmentEndDateTimeIso: string;
  customerContact: CustomerContactInformation;
  customerVehicle: CustomerVehicleInformation;
  customerAdditionalNotes?: string;
}

/** Appointment statuses recognized across the application */
export type AppointmentLifecycleStatus =
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

/** Full appointment record retrieved from the database */
export interface PersistedAppointmentRecord {
  appointmentId: string;
  startDateTimeIso: string;
  endDateTimeIso: string;
  status: AppointmentLifecycleStatus;
  customerNotes?: string;
  mechanicInternalNotes?: string;
  customer: CustomerContactInformation;
  vehicle: CustomerVehicleInformation;
  service: AutomotiveService;
  createdAtIso: string;
}

/** Response returned by server booking actions */
export interface BookingCreationResult {
  isSuccess: boolean;
  appointmentReferenceId?: string;
  userFacingErrorMessage?: string;
}
