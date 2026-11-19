'use client';

/**
 * ServiceSelector Component
 * Allows customers to browse and choose an automotive service.
 * Conforms to W3C WAI-ARIA standards for selectable option groups.
 */

import React from 'react';
import { AutomotiveService } from '@/types/booking';
import { Wrench, Disc, Cpu, Gauge, RefreshCw, Check } from 'lucide-react';

export const CATALOG_AUTOMOTIVE_SERVICES: AutomotiveService[] = [
  {
    id: 'service-synthetic-oil-change',
    name: 'Synthetic Oil & Filter Change',
    description:
      'Complete synthetic motor oil drain and refill, premium filter replacement, fluid top-off, and multi-point safety check.',
    durationInMinutes: 60,
    estimatedPriceInDollars: 75,
    isActive: true,
  },
  {
    id: 'service-brake-pad-replacement',
    name: 'Brake Inspection & Pad Replacement',
    description:
      'Comprehensive inspection of rotors, calipers, and hydraulic lines with front or rear ceramic pad installation.',
    durationInMinutes: 90,
    estimatedPriceInDollars: 180,
    isActive: true,
  },
  {
    id: 'service-engine-diagnostics',
    name: 'General Diagnostics & Check Engine',
    description:
      'Professional OBD-II computer diagnostic scanning, battery/charging circuit analysis, and comprehensive sensor review.',
    durationInMinutes: 60,
    estimatedPriceInDollars: 95,
    isActive: true,
  },
  {
    id: 'service-tire-rotation-balance',
    name: 'Tire Rotation & High-Speed Balancing',
    description:
      'Even tread wear cross-rotation, tire pressure calibration, and precision electronic wheel balancing.',
    durationInMinutes: 45,
    estimatedPriceInDollars: 50,
    isActive: true,
  },
  {
    id: 'service-fluid-flush-exchange',
    name: 'Transmission & Coolant Flush',
    description:
      'Complete cooling system and transmission fluid exchange with pressurized leak and thermostat testing.',
    durationInMinutes: 90,
    estimatedPriceInDollars: 160,
    isActive: true,
  },
];

interface ServiceSelectorProps {
  currentlySelectedServiceId: string | null;
  onServiceSelectionChange: (selectedService: AutomotiveService) => void;
}

export default function ServiceSelector({
  currentlySelectedServiceId,
  onServiceSelectionChange,
}: ServiceSelectorProps) {
  function renderServiceCategoryIcon(serviceIdentifier: string) {
    const iconBaseClasses = 'w-5 h-5';
    switch (serviceIdentifier) {
      case 'service-brake-pad-replacement':
        return <Disc className={`${iconBaseClasses} text-amber-500`} aria-hidden="true" />;
      case 'service-engine-diagnostics':
        return <Cpu className={`${iconBaseClasses} text-purple-500`} aria-hidden="true" />;
      case 'service-tire-rotation-balance':
        return <Gauge className={`${iconBaseClasses} text-emerald-500`} aria-hidden="true" />;
      case 'service-fluid-flush-exchange':
        return <RefreshCw className={`${iconBaseClasses} text-cyan-500`} aria-hidden="true" />;
      default:
        return <Wrench className={`${iconBaseClasses} text-blue-500`} aria-hidden="true" />;
    }
  }

  return (
    <fieldset className="space-y-3 border-0 p-0 m-0">
      <legend className="text-sm font-semibold text-gray-600 uppercase tracking-wider block mb-2">
        Step 1: Select an Automotive Service
      </legend>

      <div
        role="radiogroup"
        aria-label="Available auto repair and maintenance services"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {CATALOG_AUTOMOTIVE_SERVICES.map((automotiveService) => {
          const isServiceSelected =
            currentlySelectedServiceId === automotiveService.id;

          return (
            <div
              key={automotiveService.id}
              role="radio"
              aria-checked={isServiceSelected}
              tabIndex={0}
              onClick={() => onServiceSelectionChange(automotiveService)}
              onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key === ' ' || keyboardEvent.key === 'Enter') {
                  keyboardEvent.preventDefault();
                  onServiceSelectionChange(automotiveService);
                }
              }}
              className={`cursor-pointer text-left p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                isServiceSelected
                  ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {renderServiceCategoryIcon(automotiveService.id)}
                </div>

                {isServiceSelected && (
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white"
                    aria-label="Selected"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-base leading-snug">
                  {automotiveService.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {automotiveService.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-medium">
                  {automotiveService.durationInMinutes} minutes
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  Est. ${automotiveService.estimatedPriceInDollars}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
