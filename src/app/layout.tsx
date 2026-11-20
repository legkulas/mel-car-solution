/**
 * Root Layout Component
 * Provides global HTML skeleton, W3C accessibility skip navigation links, and document metadata.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mel Gives Car Solution | Certified Automotive Repair & Scheduling',
  description:
    'Book certified automotive mechanic appointments online with upfront pricing and guaranteed 1-hour bay slots.',
  keywords: [
    'car repair',
    'mechanic scheduling',
    'oil change',
    'brake service',
    'engine diagnostics',
    'auto repair shop',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col font-sans bg-slate-50 text-gray-900"
        suppressHydrationWarning
      >
        {/* W3C Accessibility: Skip Navigation Link for screen readers & keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
