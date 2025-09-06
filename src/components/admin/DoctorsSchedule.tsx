import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

const DoctorsSchedule = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDoctors();
      setDoctors(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      "Family Medicine": "bg-blue-100 text-blue-800 border-blue-200",
      "Internal Medicine": "bg-green-100 text-green-800 border-green-200",
      "Cardiology": "bg-red-100 text-red-800 border-red-200",
      "Pediatrics": "bg-purple-100 text-purple-800 border-purple-200",
      "Dermatology": "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[specialty as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Doctors...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Doctor Schedules & Availability
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <Badge className={getSpecialtyColor(doctor.specialty)}>
                    {doctor.specialty}
                  </Badge>
                </div>
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Today's Availability
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {doctor.availability.map((time, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-md"
                    >
                      <Clock className="w-3 h-3 mr-1 text-green-600" />
                      <span className="text-sm text-green-800">
                        {formatTime(time)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <strong>Available Slots:</strong> {doctor.availability.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No doctors found
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorsSchedule;