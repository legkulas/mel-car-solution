'use client';

/**
 * BookingWizard Component
 * Coordinates the 4-step customer appointment reservation workflow.
 * Conforms to W3C specifications for multi-step forms, landmarks, and live status messaging.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import {
  AutomotiveService,
  AppointmentTimeSlot,
  CustomerContactInformation,
  CustomerVehicleInformation,
} from '@/types/booking';
import ServiceSelector, {
  CATALOG_AUTOMOTIVE_SERVICES,
} from './ServiceSelector';
import BookingSlotPicker from './BookingSlotPicker';
import VehicleForm from './VehicleForm';
import { submitCustomerAppointmentBooking } from '@/app/actions/book';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Printer,
  RotateCcw,
} from 'lucide-react';

interface SelectableCalendarDate {
  dateIsoString: string;
  weekdayAbbreviated: string;
  monthAndDayFormatted: string;
}

export default function BookingWizard() {
  const [currentWizardStep, setCurrentWizardStep] = useState<number>(1);
  const [
    selectedAutomotiveService,
    setSelectedAutomotiveService,
  ] = useState<AutomotiveService | null>(CATALOG_AUTOMOTIVE_SERVICES[0]);

  // Today in YYYY-MM-DD
  const defaultCurrentDateString = new Date().toISOString().split('T')[0];
  const [selectedCalendarDateIso, setSelectedCalendarDateIso] =
    useState<string>(defaultCurrentDateString);
  const [
    chosenAppointmentTimeSlot,
    setChosenAppointmentTimeSlot,
  ] = useState<AppointmentTimeSlot | null>(null);

  const [customerContactDetails, setCustomerContactDetails] =
    useState<CustomerContactInformation>({
      customerFullName: '',
      customerEmailAddress: '',
      customerPhoneNumber: '',
    });

  const [customerVehicleDetails, setCustomerVehicleDetails] =
    useState<CustomerVehicleInformation>({
      modelYear: new Date().getFullYear(),
      manufacturerMake: '',
      modelName: '',
      licensePlateNumber: '',
    });

  const [customerAdditionalNotes, setCustomerAdditionalNotes] =
    useState<string>('');

  const [isSubmittingAppointment, setIsSubmittingAppointment] =
    useState<boolean>(false);
  const [
    bookingValidationErrorMessage,
    setBookingValidationErrorMessage,
  ] = useState<string | null>(null);
  const [
    confirmedAppointmentReferenceId,
    setConfirmedAppointmentReferenceId,
  ] = useState<string | null>(null);

  // Generate the next 7 business dates
  const selectableCalendarDates: SelectableCalendarDate[] = Array.from(
    { length: 7 },
    (_, dayOffsetIndex) => {
      const prospectiveDate = new Date();
      prospectiveDate.setDate(prospectiveDate.getDate() + dayOffsetIndex);

      const dateIsoString = prospectiveDate.toISOString().split('T')[0];
      const weekdayAbbreviated = prospectiveDate.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      const monthAndDayFormatted = prospectiveDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        dateIsoString,
        weekdayAbbreviated,
        monthAndDayFormatted,
      };
    }
  );

  const handleAdvanceToNextStep = () => {
    setBookingValidationErrorMessage(null);

    if (currentWizardStep === 1 && !selectedAutomotiveService) {
      setBookingValidationErrorMessage('Please select a service before proceeding.');
      return;
    }

    if (currentWizardStep === 2 && !chosenAppointmentTimeSlot) {
      setBookingValidationErrorMessage('Please select an available 1-hour time slot.');
      return;
    }

    if (currentWizardStep === 3) {
      if (
        !customerContactDetails.customerFullName.trim() ||
        !customerContactDetails.customerPhoneNumber.trim() ||
        !customerContactDetails.customerEmailAddress.trim()
      ) {
        setBookingValidationErrorMessage(
          'Please complete all required contact fields (Name, Phone, and Email).'
        );
        return;
      }

      if (
        !customerVehicleDetails.manufacturerMake.trim() ||
        !customerVehicleDetails.modelName.trim()
      ) {
        setBookingValidationErrorMessage(
          'Please provide your vehicle make and model.'
        );
        return;
      }
    }

    setCurrentWizardStep((previousStep) => previousStep + 1);
  };

  const handleReturnToPreviousStep = () => {
    setBookingValidationErrorMessage(null);
    setCurrentWizardStep((previousStep) => Math.max(1, previousStep - 1));
  };

  const handleFinalBookingSubmission = async () => {
    if (!selectedAutomotiveService || !chosenAppointmentTimeSlot) {
      return;
    }

    setIsSubmittingAppointment(true);
    setBookingValidationErrorMessage(null);

    const bookingResult = await submitCustomerAppointmentBooking({
      selectedServiceId: selectedAutomotiveService.id,
      appointmentStartDateTimeIso: chosenAppointmentTimeSlot.startDateTimeIso,
      appointmentEndDateTimeIso: chosenAppointmentTimeSlot.endDateTimeIso,
      customerContact: customerContactDetails,
      customerVehicle: customerVehicleDetails,
      customerAdditionalNotes,
    });

    setIsSubmittingAppointment(false);

    if (bookingResult.isSuccess && bookingResult.appointmentReferenceId) {
      setConfirmedAppointmentReferenceId(bookingResult.appointmentReferenceId);
    } else {
      setBookingValidationErrorMessage(
        bookingResult.userFacingErrorMessage ||
          'Failed to record your appointment. Please choose another time slot.'
      );
    }
  };

  // SUCCESS CONFIRMATION STATE
  if (confirmedAppointmentReferenceId) {
    return (
      <section
        aria-labelledby="booking-confirmation-heading"
        className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6"
      >
        <div
          className="w-16 h-16 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-green-700 bg-green-50 px-3.5 py-1 rounded-full border border-green-200">
            Booking Confirmed
          </span>
          <h2
            id="booking-confirmation-heading"
            className="text-2xl font-bold text-gray-900 mt-3"
          >
            Your Appointment Is Scheduled!
          </h2>
          <p className="text-sm text-gray-600 mt-1.5">
            A confirmation receipt and shop address details have been sent to{' '}
            <strong className="text-gray-900 font-semibold">
              {customerContactDetails.customerEmailAddress}
            </strong>.
          </p>
        </div>

        {/* Appointment Summary Card */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 text-sm border border-gray-200/70">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Service</span>
            <span className="font-semibold text-gray-900">
              {selectedAutomotiveService?.name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Scheduled Time</span>
            <span className="font-semibold text-gray-900">
              {selectedCalendarDateIso} ({chosenAppointmentTimeSlot?.formattedDisplayLabel})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Vehicle</span>
            <span className="font-semibold text-gray-900">
              {customerVehicleDetails.modelYear}{' '}
              {customerVehicleDetails.manufacturerMake}{' '}
              {customerVehicleDetails.modelName}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-2.5 text-xs text-gray-500">
            <span>Confirmation Code</span>
            <span className="font-mono font-bold text-gray-800">
              {confirmedAppointmentReferenceId}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Printer className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmedAppointmentReferenceId(null);
              setCurrentWizardStep(1);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Schedule Another Car</span>
          </button>
        </div>
      </section>
    );
  }

  const stepLabels = ['Service', 'Time Slot', 'Vehicle & Info', 'Review'];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden">
      {/* Header Landmark */}
      <header className="px-6 py-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-gray-200 bg-black shrink-0">
              <Image
                src="/logo.jpg"
                alt="Mel Gives Car Solution certified workshop emblem"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-tight">
                Mel Gives Car Solution
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                <span>Certified Mechanic Bay Scheduling</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-gray-500">
              Step {currentWizardStep} of 4
            </span>
          </div>
        </div>

        {/* Step Progress List (W3C Accessible Breadcrumb Pattern) */}
        <nav aria-label="Booking process progress">
          <ol className="grid grid-cols-4 gap-2 list-none p-0 m-0">
            {stepLabels.map((stepTitle, stepIndex) => {
              const stepNumber = stepIndex + 1;
              const isCurrentStep = currentWizardStep === stepNumber;
              const isCompletedStep = currentWizardStep > stepNumber;

              return (
                <li key={stepTitle} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCompletedStep || isCurrentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[10px] hidden sm:block font-medium ${
                      isCurrentStep
                        ? 'text-blue-600 font-bold'
                        : isCompletedStep
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {stepTitle}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      {/* Main Form Body */}
      <div className="p-6">
        {bookingValidationErrorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{bookingValidationErrorMessage}</span>
          </div>
        )}

        {/* STEP 1: Select Service */}
        {currentWizardStep === 1 && (
          <ServiceSelector
            currentlySelectedServiceId={selectedAutomotiveService?.id || null}
            onServiceSelectionChange={(chosenService) =>
              setSelectedAutomotiveService(chosenService)
            }
          />
        )}

        {/* STEP 2: Date & Slot Picker */}
        {currentWizardStep === 2 && (
          <div className="space-y-5">
            <fieldset className="border-0 p-0 m-0">
              <legend className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span>Step 2: Choose an Appointment Date</span>
              </legend>

              <div
                role="group"
                aria-label="Upcoming calendar dates"
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
              >
                {selectableCalendarDates.map((calendarDate) => {
                  const isDateSelected =
                    selectedCalendarDateIso === calendarDate.dateIsoString;

                  return (
                    <button
                      key={calendarDate.dateIsoString}
                      type="button"
                      aria-pressed={isDateSelected}
                      aria-label={`${calendarDate.weekdayAbbreviated}, ${calendarDate.monthAndDayFormatted}`}
                      onClick={() => {
                        setSelectedCalendarDateIso(calendarDate.dateIsoString);
                        setChosenAppointmentTimeSlot(null);
                      }}
                      className={`flex flex-col items-center py-2.5 px-3.5 rounded-2xl border text-xs min-w-[70px] transition shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                        isDateSelected
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-md shadow-blue-200'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <span className="uppercase text-[10px] opacity-80">
                        {calendarDate.weekdayAbbreviated}
                      </span>
                      <span className="text-sm font-bold mt-0.5">
                        {calendarDate.monthAndDayFormatted}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <BookingSlotPicker
              selectedCalendarDate={selectedCalendarDateIso}
              selectedSlotStartTimeIso={
                chosenAppointmentTimeSlot?.startDateTimeIso || null
              }
              onSlotSelected={(slot) => setChosenAppointmentTimeSlot(slot)}
            />
          </div>
        )}

        {/* STEP 3: Vehicle and Contact Information */}
        {currentWizardStep === 3 && (
          <VehicleForm
            customerContactDetails={customerContactDetails}
            customerVehicleDetails={customerVehicleDetails}
            customerAdditionalNotes={customerAdditionalNotes}
            onCustomerContactChange={(updatedFields) =>
              setCustomerContactDetails((prev) => ({ ...prev, ...updatedFields }))
            }
            onCustomerVehicleChange={(updatedFields) =>
              setCustomerVehicleDetails((prev) => ({ ...prev, ...updatedFields }))
            }
            onCustomerNotesChange={(updatedNotes) =>
              setCustomerAdditionalNotes(updatedNotes)
            }
          />
        )}

        {/* STEP 4: Review and Confirmation */}
        {currentWizardStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Step 4: Review Your Booking Details
            </h3>

            <div className="bg-gray-50 border border-gray-200/70 rounded-2xl p-5 space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Selected Service</span>
                <span className="font-semibold text-gray-900">
                  {selectedAutomotiveService?.name}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Appointment Window</span>
                <span className="font-semibold text-gray-900">
                  {selectedCalendarDateIso} at {chosenAppointmentTimeSlot?.formattedDisplayLabel}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Vehicle</span>
                <span className="font-semibold text-gray-900">
                  {customerVehicleDetails.modelYear}{' '}
                  {customerVehicleDetails.manufacturerMake}{' '}
                  {customerVehicleDetails.modelName}{' '}
                  {customerVehicleDetails.licensePlateNumber
                    ? `(${customerVehicleDetails.licensePlateNumber.toUpperCase()})`
                    : ''}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Customer</span>
                <span className="font-semibold text-gray-900">
                  {customerContactDetails.customerFullName} ·{' '}
                  {customerContactDetails.customerPhoneNumber}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 text-base">
                <span className="font-semibold text-gray-700">Estimated Total</span>
                <span className="font-bold text-blue-600">
                  ~${selectedAutomotiveService?.estimatedPriceInDollars}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              * Payment is rendered directly at Mel&apos;s shop upon completion of service. No advance
              credit card charge is required.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer Controls */}
      <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        {currentWizardStep > 1 ? (
          <button
            type="button"
            onClick={handleReturnToPreviousStep}
            disabled={isSubmittingAppointment}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Previous</span>
          </button>
        ) : (
          <div aria-hidden="true" />
        )}

        {currentWizardStep < 4 ? (
          <button
            type="button"
            onClick={handleAdvanceToNextStep}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalBookingSubmission}
            disabled={isSubmittingAppointment}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {isSubmittingAppointment ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Reserving Your Slot...</span>
              </>
            ) : (
              <span>Confirm Appointment</span>
            )}
          </button>
        )}
      </footer>
    </div>
  );
}
