-- Create medical appointment scheduling database schema

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  address TEXT,
  insurance_carrier VARCHAR(100),
  member_id VARCHAR(100),
  group_id VARCHAR(100),
  primary_doctor_id UUID,
  patient_type VARCHAR(20) DEFAULT 'new' CHECK (patient_type IN ('new', 'returning')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialty VARCHAR(100),
  location VARCHAR(100),
  calendar_reference VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('confirmed','cancelled','no_show','completed','pending')),
  is_new_patient BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forms table
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  template_name VARCHAR(100) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  channel VARCHAR(10) NOT NULL CHECK (channel IN ('email','sms')),
  reminder_no INTEGER NOT NULL CHECK (reminder_no IN (1,2,3)),
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_forms_appointment_id ON public.forms(appointment_id);
CREATE INDEX idx_reminders_appointment_id ON public.reminders(appointment_id);

-- Add foreign key constraint for doctor reference in patients
ALTER TABLE public.patients ADD CONSTRAINT fk_patients_doctor FOREIGN KEY (primary_doctor_id) REFERENCES public.doctors(id);

-- Enable Row Level Security on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients (users can only see their own data)
CREATE POLICY "Users can view their own patient record" 
ON public.patients 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own patient record" 
ON public.patients 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own patient record" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Create RLS policies for doctors (readable by all authenticated users)
CREATE POLICY "Doctors are viewable by authenticated users" 
ON public.doctors 
FOR SELECT 
TO authenticated
USING (true);

-- Create RLS policies for appointments (users can only see their own appointments)
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid()::text = patient_id::text);

-- Create RLS policies for forms (users can only see forms for their appointments)
CREATE POLICY "Users can view forms for their appointments" 
ON public.forms 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.appointments 
  WHERE appointments.id = forms.appointment_id 
  AND appointments.patient_id::text = auth.uid()::text
));

CREATE POLICY "Users can update forms for their appointments" 
ON public.forms 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.appointments 
  WHERE appointments.id = forms.appointment_id 
  AND appointments.patient_id::text = auth.uid()::text
));

-- Create RLS policies for reminders (users can only see reminders for their appointments)
CREATE POLICY "Users can view reminders for their appointments" 
ON public.reminders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.appointments 
  WHERE appointments.id = reminders.appointment_id 
  AND appointments.patient_id::text = auth.uid()::text
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors
INSERT INTO public.doctors (name, specialty, location, calendar_reference) VALUES
('Dr. Sarah Johnson', 'General Practice', 'Main Clinic', 'dr_johnson_schedule'),
('Dr. Michael Chen', 'Cardiology', 'Heart Center', 'dr_chen_schedule'),
('Dr. Emily Rodriguez', 'Pediatrics', 'Children''s Wing', 'dr_rodriguez_schedule');