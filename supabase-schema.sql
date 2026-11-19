-- =====================================================================
-- Mel Gives Car Solution - Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =====================================================================

-- 0. Enable extension for range exclusion checks (prevents double bookings)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    price_estimate NUMERIC(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Services
INSERT INTO services (name, description, duration_minutes, price_estimate) VALUES
('Synthetic Oil & Filter Change', 'Full synthetic oil replacement, new filter, fluid top-up, and 20-point safety inspection.', 60, 75.00),
('Brake Inspection & Pad Replacement', 'Comprehensive brake system check, rotor inspection, and front or rear pad replacement.', 90, 180.00),
('General Diagnostics & Check Engine', 'OBD-II computer diagnostics, battery/alternator test, and component troubleshooting.', 60, 95.00),
('Tire Rotation & Wheel Balancing', 'Even tread wear rotation, pressure optimization, and precision high-speed wheel balancing.', 45, 50.00),
('Transmission & Coolant Flush', 'Complete fluid exchange, system purge, and leak pressure test.', 90, 160.00)
ON CONFLICT DO NOTHING;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    year INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    license_plate VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blocked Slots (Holidays, Lunch Breaks, Emergency Bay Maintenance)
CREATE TABLE IF NOT EXISTS blocked_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reason VARCHAR(255) DEFAULT 'Mechanic Unavailable',
    CONSTRAINT valid_block_range CHECK (end_time > start_time)
);

-- 5. Appointments Table (With Exclusion Constraint Against Overlaps)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    service_id UUID NOT NULL REFERENCES services(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    customer_notes TEXT,
    mechanic_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_appointment_range CHECK (end_time > start_time),
    
    -- Absolute database-level lock to prevent double-booking
    EXCLUDE USING gist (
        tsrange(start_time, end_time) WITH &&
    ) WHERE (status != 'cancelled')
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_appointments_range ON appointments (start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles (customer_id);

-- Row Level Security (RLS) setup
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Public read policies for booking flow
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can read appointment times for slot calculation" ON appointments FOR SELECT USING (status != 'cancelled');
CREATE POLICY "Public can read blocked slots" ON blocked_slots FOR SELECT USING (TRUE);
