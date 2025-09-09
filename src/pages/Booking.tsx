import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, Clock, User as UserIcon, ArrowLeft, AlertTriangle } from "lucide-react";
import { format, addDays, isBefore, startOfDay, parse } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types"; // Import the Database type

// Schema for form validation
const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  isNewPatient: z.boolean().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// Explicitly define the Doctor type based on your Supabase schema
type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingPageProps {
  user: User;
  session: Session;
}

const BookingPage = ({ user, session }: BookingPageProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [noDoctorsFound, setNoDoctorsFound] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      isNewPatient: false,
    },
  });

  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("date");

  const availableTimeSlots = useMemo(() => {
    const startHour = 9;
    const endHour = 17;
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      }
    }
    return slots;
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchTimeSlots = async () => {
    if (!selectedDoctorId || !selectedDate) return;

    setLoadingSlots(true);
    setValue("time", ""); // Reset time when date or doctor changes
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const { data: bookedSlots, error } = await supabase
      .from("appointments")
      .select("start_time")
      .eq("doctor_id", selectedDoctorId)
      .gte("start_time", `${formattedDate}T00:00:00Z`)
      .lt("start_time", `${formattedDate}T23:59:59Z`);

    if (error) {
      toast({
        title: "Error fetching time slots",
        description: error.message,
        variant: "destructive",
      });
      setTimeSlots([]);
      setLoadingSlots(false);
      return;
    }

    const bookedTimes = bookedSlots.map(slot => format(new Date(slot.start_time), "HH:mm"));
    
    const allSlots = availableTimeSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time),
    }));

    setTimeSlots(allSlots);
    setLoadingSlots(false);
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [selectedDoctorId, selectedDate]);

    const fetchDoctors = async () => {
    const { data, error } = await supabase.from("doctors").select("*").order("name");
    if (error) {
      toast({
        title: "Error Fetching Doctors",
        description: error.message,
        variant: "destructive",
      });
      setNoDoctorsFound(true);
    } else if (data) {
      setDoctors(data);
      setNoDoctorsFound(data.length === 0);
    } else {
        setNoDoctorsFound(true);
    }
  };


  const onSubmit = async (formData: AppointmentFormValues) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      const { doctorId, date, time, notes, isNewPatient } = formData;
      const startTime = parse(`${format(date, "yyyy-MM-dd")} ${time}`, "yyyy-MM-dd HH:mm", new Date());

      const { error: insertError } = await supabase.from("appointments").insert([
        {
          patient_id: user.id,
          doctor_id: doctorId,
          start_time: startTime.toISOString(),
          end_time: new Date(startTime.getTime() + 30 * 60000).toISOString(),
          notes,
          status: "pending",
          is_new_patient: isNewPatient,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      // Send confirmation email
      try {
        const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId: `apt_${Date.now()}`,
            userEmail: user.email,
            appointmentDate: format(date, "PPP"),
            appointmentTime: time,
            doctorId: doctorId
          })
        });

        if (!emailResponse.ok) {
          console.warn('Failed to send confirmation email, but appointment was booked successfully');
        }
      } catch (emailError) {
        console.warn('Email service error:', emailError);
        // Don't fail the booking if email fails
      }

      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment is confirmed for ${format(date, "PPP")} at ${time}. A confirmation email has been sent to ${user.email}.`,
      });
      reset({ doctorId: "", date: undefined, time: "", notes: "", isNewPatient: false });

    } catch (error: any) {
      if (error.code === '23503') {
        toast({
          title: "Booking Failed",
          description: "Patient profile not found. Please complete your profile before booking.",
          variant: "destructive",
        });
      } else if (error.code === '23505') {
        toast({
          title: "Booking Failed",
          description: "This appointment slot was just taken. The schedule has been updated.",
          variant: "destructive",
        });
        fetchTimeSlots();
      } else {
        toast({
          title: "Error Booking Appointment",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="border-t-4 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl text-gray-800">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Book an Appointment
            </CardTitle>
            <CardDescription className="mt-1">
              Fill out the form below to schedule your visit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="doctorId" className="text-lg font-semibold text-gray-700">1. Select a Doctor</Label>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={noDoctorsFound}>
                      <SelectTrigger className="text-base py-6">
                        <SelectValue placeholder="Choose a healthcare professional..." />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id} className="py-2">
                            <div className="flex items-center gap-3">
                              <UserIcon className="w-5 h-5 text-gray-500" />
                              <div>
                                <div className="font-semibold">{doctor.name}</div>
                                <div className="text-sm text-gray-500">{doctor.specialty} - {doctor.location}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.doctorId && <p className="text-sm text-red-600">{errors.doctorId.message}</p>}
                
                {noDoctorsFound && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Doctors Available</AlertTitle>
                    <AlertDescription>
                      We couldn't find any doctors. This might be due to a permissions issue. Please ensure RLS policies for the 'doctors' table are correctly configured in Supabase.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">2. Choose a Date</Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDateDisabled}
                        fromDate={new Date()}
                        toDate={addDays(new Date(), 60)}
                        className="rounded-md border bg-white"
                      />
                    )}
                  />
                  {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">3. Select a Time</Label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md bg-gray-50">
                      <p className="text-gray-500">Loading available times...</p>
                    </div>
                  ) : selectedDoctorId && selectedDate ? (
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                          {timeSlots.length > 0 && timeSlots.some(slot => slot.available) ? (
                            timeSlots.map((slot) => (
                              <Button
                                key={slot.time}
                                type="button"
                                variant={field.value === slot.time ? "default" : "outline"}
                                disabled={!slot.available}
                                onClick={() => {
                                  if (slot.available) field.onChange(slot.time);
                                }}
                                className={`w-full text-base ${
                                  !slot.available ? 'text-gray-400 line-through' : ""
                                }`}
                              >
                                {slot.time}
                              </Button>
                            ))
                          ) : (
                            <p className="col-span-3 text-center text-gray-500 p-4">
                              No available slots for this day.
                            </p>
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md bg-gray-50">
                      <p className="text-gray-500 text-center p-4">Select a doctor and date to see available times.</p>
                    </div>
                  )}
                  {errors.time && <p className="text-sm text-red-600 mt-2">{errors.time.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-semibold text-gray-700">4. Additional Notes (Optional)</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="notes"
                      placeholder="Let the doctor know if you have any specific concerns..."
                      {...field}
                      rows={4}
                      className="text-base"
                    />
                  )}
                />
              </div>

              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg font-bold py-6"
                  size="lg"
                >
                  {loading ? "Scheduling..." : "Confirm & Book Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BookingPage;
