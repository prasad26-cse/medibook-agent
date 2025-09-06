import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

interface Appointment {
  id: string;
  patient_name: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
  patient_type: string;
  phone?: string;
  insurance?: string;
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAppointments();
      setAppointments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await adminService.updateAppointmentStatus(id, newStatus);
      toast({
        title: "Success",
        description: "Appointment status updated"
      });
      loadAppointments();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update appointment",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPatientTypeColor = (type: string) => {
    return type === "New" 
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Appointments...</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Appointments Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      {appointment.patient_name}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPatientTypeColor(appointment.patient_type)}>
                      {appointment.patient_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {appointment.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                          {appointment.phone}
                        </div>
                      )}
                      {appointment.insurance && (
                        <div className="text-muted-foreground">
                          {appointment.insurance}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {appointment.status !== "Confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(appointment.id, "Confirmed")}
                        >
                          Confirm
                        </Button>
                      )}
                      {appointment.status !== "Cancelled" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(appointment.id, "Cancelled")}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {appointments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No appointments found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsTable;