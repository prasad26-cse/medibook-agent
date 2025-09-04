import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, User, MapPin } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate available time slots (free version - simple time slots)
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: Math.random() > 0.3 // Simple availability simulation
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      setTimeSlots(generateTimeSlots());
    }
  }, [selectedDate, selectedDoctor]);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error fetching doctors",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setDoctors(data || []);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Please complete all fields",
        description: "Date, time, and doctor selection are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create appointment with free tier limitations
      const appointmentData = {
        patient_id: user.id,
        doctor_id: selectedDoctor,
        start_time: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`).toISOString(),
        end_time: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`).toISOString(),
        duration_minutes: 30,
        notes: notes,
        status: 'pending',
        is_new_patient: isNewPatient
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) throw error;

      // Send confirmation using free tier email (basic notification)
      await supabase.functions.invoke('send-confirmation', {
        body: {
          appointmentId: data[0].id,
          userEmail: user.email,
          appointmentDate: format(selectedDate, 'PPP'),
          appointmentTime: selectedTime,
          doctorId: selectedDoctor
        }
      });

      toast({
        title: "Appointment booked successfully!",
        description: `Your appointment is scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setSelectedDoctor(undefined);
      setNotes("");
      setIsNewPatient(false);

    } catch (error: any) {
      toast({
        title: "Error booking appointment",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CalendarIcon className="w-5 h-5" />
            Book an Appointment
          </CardTitle>
          <CardDescription>
            Schedule your medical appointment (Free tier - basic scheduling)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Doctor
            </Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.specialty} • {doctor.location}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                fromDate={new Date()}
                toDate={addDays(new Date(), 30)} // Free tier: 30 days ahead only
                className="rounded-lg border"
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Available Times
              </Label>
              {selectedDate && selectedDoctor ? (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className="justify-center"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please select a doctor and date to view available times
                </p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newPatient"
                checked={isNewPatient}
                onChange={(e) => setIsNewPatient(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="newPatient">I am a new patient</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or requests..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Book Button */}
          <Button 
            onClick={handleBookAppointment}
            disabled={loading || !selectedDate || !selectedTime || !selectedDoctor}
            className="w-full"
            size="lg"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>

          {/* Free Tier Notice */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Free Tier Features:</strong> Basic scheduling, email confirmations, 30-day booking window. 
            Premium features like SMS reminders, AI scheduling, and extended booking require upgrade.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;