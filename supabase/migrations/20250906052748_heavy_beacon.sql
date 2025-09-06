/*
  # Fix patient creation for new users

  1. Changes
    - Update handle_new_user() function to create both profile and patient records
    - Ensure patient_id foreign key constraint is satisfied when booking appointments
  
  2. Security
    - Maintains existing RLS policies
    - No changes to security model
*/

-- Update the handle_new_user function to also create a patient record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, dob, patient_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    (NEW.raw_user_meta_data->>'dob')::date,
    COALESCE(NEW.raw_user_meta_data->>'patient_type', 'new')
  );

  -- Insert into patients table to satisfy foreign key constraint
  INSERT INTO public.patients (
    id,
    first_name,
    last_name,
    email,
    phone,
    dob,
    patient_type
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'dob')::date, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data->>'patient_type', 'new')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;