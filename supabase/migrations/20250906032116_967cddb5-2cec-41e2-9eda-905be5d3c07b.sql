-- Insert sample doctors data
INSERT INTO public.doctors (id, name, specialty, location, calendar_reference) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Dr. Sarah Smith', 'Family Medicine', 'Main Office', 'dr-smith-calendar'),
('550e8400-e29b-41d4-a716-446655440001', 'Dr. Michael Johnson', 'Internal Medicine', 'North Clinic', 'dr-johnson-calendar'),
('550e8400-e29b-41d4-a716-446655440002', 'Dr. Emily Brown', 'Cardiology', 'Heart Center', 'dr-brown-calendar'),
('550e8400-e29b-41d4-a716-446655440003', 'Dr. David Davis', 'Pediatrics', 'Children Wing', 'dr-davis-calendar')
ON CONFLICT (id) DO NOTHING;