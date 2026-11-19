'use client';

/**
 * VehicleForm Component
 * Collects customer contact information, vehicle details, and mechanical symptoms.
 * Fully compliant with W3C HTML5 Form specifications and WCAG accessibility standards.
 */

import React from 'react';
import {
  CustomerContactInformation,
  CustomerVehicleInformation,
} from '@/types/booking';
import { User, Car, FileText } from 'lucide-react';

interface VehicleFormProps {
  customerContactDetails: CustomerContactInformation;
  customerVehicleDetails: CustomerVehicleInformation;
  customerAdditionalNotes: string;
  onCustomerContactChange: (
    updatedFields: Partial<CustomerContactInformation>
  ) => void;
  onCustomerVehicleChange: (
    updatedFields: Partial<CustomerVehicleInformation>
  ) => void;
  onCustomerNotesChange: (updatedNotesText: string) => void;
}

export default function VehicleForm({
  customerContactDetails,
  customerVehicleDetails,
  customerAdditionalNotes,
  onCustomerContactChange,
  onCustomerVehicleChange,
  onCustomerNotesChange,
}: VehicleFormProps) {
  const currentCalendarYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* 1. Customer Contact Fieldset */}
      <fieldset className="space-y-3 border-0 p-0 m-0">
        <legend className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span>Step 3A: Your Contact Information</span>
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="customer-full-name-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="customer-full-name-input"
              name="customerFullName"
              type="text"
              required
              aria-required="true"
              autoComplete="name"
              placeholder="e.g. Alex Morgan"
              value={customerContactDetails.customerFullName}
              onChange={(changeEvent) =>
                onCustomerContactChange({
                  customerFullName: changeEvent.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="customer-phone-number-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Phone Number <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="customer-phone-number-input"
              name="customerPhoneNumber"
              type="tel"
              required
              aria-required="true"
              autoComplete="tel"
              placeholder="(555) 012-3456"
              value={customerContactDetails.customerPhoneNumber}
              onChange={(changeEvent) =>
                onCustomerContactChange({
                  customerPhoneNumber: changeEvent.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="customer-email-address-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="customer-email-address-input"
              name="customerEmailAddress"
              type="email"
              required
              aria-required="true"
              autoComplete="email"
              placeholder="alex@example.com"
              value={customerContactDetails.customerEmailAddress}
              onChange={(changeEvent) =>
                onCustomerContactChange({
                  customerEmailAddress: changeEvent.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              We send your appointment receipt and reminder to this email.
            </p>
          </div>
        </div>
      </fieldset>

      {/* 2. Vehicle Details Fieldset */}
      <fieldset className="space-y-3 border-0 p-0 m-0">
        <legend className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <Car className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span>Step 3B: Vehicle Specification</span>
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="vehicle-model-year-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Year <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="vehicle-model-year-input"
              name="vehicleModelYear"
              type="number"
              min="1970"
              max={currentCalendarYear + 1}
              required
              aria-required="true"
              value={customerVehicleDetails.modelYear || ''}
              onChange={(changeEvent) =>
                onCustomerVehicleChange({
                  modelYear:
                    parseInt(changeEvent.target.value, 10) || currentCalendarYear,
                })
              }
              placeholder="2018"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="vehicle-manufacturer-make-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Make <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="vehicle-manufacturer-make-input"
              name="vehicleManufacturerMake"
              type="text"
              required
              aria-required="true"
              placeholder="e.g. Toyota, Honda"
              value={customerVehicleDetails.manufacturerMake}
              onChange={(changeEvent) =>
                onCustomerVehicleChange({
                  manufacturerMake: changeEvent.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="vehicle-model-name-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Model <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="vehicle-model-name-input"
              name="vehicleModelName"
              type="text"
              required
              aria-required="true"
              placeholder="e.g. Civic, RAV4"
              value={customerVehicleDetails.modelName}
              onChange={(changeEvent) =>
                onCustomerVehicleChange({
                  modelName: changeEvent.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="vehicle-license-plate-number-input"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              License Plate{' '}
              <span className="text-gray-400 font-normal">(Optional, helps mechanic prep bay)</span>
            </label>
            <input
              id="vehicle-license-plate-number-input"
              name="vehicleLicensePlateNumber"
              type="text"
              placeholder="e.g. 7XYZ89"
              value={customerVehicleDetails.licensePlateNumber || ''}
              onChange={(changeEvent) =>
                onCustomerVehicleChange({
                  licensePlateNumber: changeEvent.target.value.toUpperCase(),
                })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </fieldset>

      {/* 3. Symptoms and Requests */}
      <div className="space-y-2">
        <label
          htmlFor="customer-symptoms-notes-textarea"
          className="block text-xs font-medium text-gray-700 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
          <span>Vehicle Symptoms or Notes (Optional)</span>
        </label>
        <textarea
          id="customer-symptoms-notes-textarea"
          name="customerAdditionalNotes"
          rows={3}
          value={customerAdditionalNotes}
          onChange={(changeEvent) => onCustomerNotesChange(changeEvent.target.value)}
          placeholder="Describe any warning lights, rattling, squeaks, or specific service instructions..."
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>
    </div>
  );
}
