-- Reset and recreate core schema for MedSchedule app with secure RLS and robust triggers
-- WARNING: This migration drops existing tables. Data will be lost.

-- 1) Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2) Clean up existing objects
DROP TABLE IF EXISTS public.reminders CASCADE;
DROP TABLE IF EXISTS public.forms CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;

-- Keep handle_new_user function if it exists, otherwise create it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create a minimal patient record upon auth signup
  INSERT INTO public.patients (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 3) Recreate tables

-- Patients: keyed by auth uid (no FK to auth schema to avoid coupling)
CREATE TABLE public.patients (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  dob date,
  patient_type text DEFAULT 'new',
  address text,
  insurance_carrier text,
  member_id text,
  group_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- RLS: user can manage their own patient record
CREATE POLICY "Users can insert their own patient record"
ON public.patients FOR INSERT
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own patient record"
ON public.patients FOR UPDATE
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own patient record"
ON public.patients FOR SELECT
USING (auth.uid()::text = id::text);

CREATE TRIGGER trg_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Doctors
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  location text,
  calendar_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- RLS: authenticated users can view doctors
CREATE POLICY "Doctors are viewable by authenticated users"
ON public.doctors FOR SELECT
TO authenticated
USING (true);

CREATE TRIGGER trg_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Appointments
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  start_time timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  end_time timestamptz NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  is_new_patient boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique start per doctor to avoid double-booking same slot
CREATE UNIQUE INDEX IF NOT EXISTS uniq_doctor_start_time
ON public.appointments (doctor_id, start_time);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS: patient can CRUD their own appointments (no delete by default)
CREATE POLICY "Users can view their own appointments"
ON public.appointments FOR SELECT
USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can create their own appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can update their own appointments"
ON public.appointments FOR UPDATE
USING (auth.uid()::text = patient_id::text);

CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure end_time is set from start_time + duration
CREATE OR REPLACE FUNCTION public.ensure_appointment_end_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NULL OR NEW.end_time <= NEW.start_time THEN
    NEW.end_time = NEW.start_time + (NEW.duration_minutes || ' minutes')::interval;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointments_set_end_time
BEFORE INSERT OR UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.ensure_appointment_end_time();

-- Forms
CREATE TABLE public.forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  template_name text NOT NULL,
  responses jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  completed_at timestamptz
);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view forms for their appointments"
ON public.forms FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.appointments a
  WHERE a.id = forms.appointment_id
    AND a.patient_id::text = auth.uid()::text
));

CREATE POLICY "Users can update forms for their appointments"
ON public.forms FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.appointments a
  WHERE a.id = forms.appointment_id
    AND a.patient_id::text = auth.uid()::text
));

CREATE TRIGGER trg_forms_updated_at
BEFORE UPDATE ON public.forms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reminders
CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  channel text NOT NULL,
  reminder_no integer NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reminders for their appointments"
ON public.reminders FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.appointments a
  WHERE a.id = reminders.appointment_id
    AND a.patient_id::text = auth.uid()::text
));

CREATE TRIGGER trg_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Trigger to auto-create patient record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5) Seed some doctors for testing
INSERT INTO public.doctors (name, specialty, location)
VALUES
  ('Dr. Amelia Carter', 'Allergy & Immunology', 'Main Clinic - Room 301'),
  ('Dr. Victor Singh', 'Pulmonology', 'Main Clinic - Room 215'),
  ('Dr. Elena Rossi', 'Internal Medicine', 'Downtown Office - Suite 10');
