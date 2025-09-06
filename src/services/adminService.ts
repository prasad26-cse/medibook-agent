// Simple admin service using localStorage (no backend needed)
interface AdminStats {
  total_appointments: number;
  confirmed_appointments: number;
  pending_appointments: number;
  total_patients: number;
  new_patients: number;
  returning_patients: number;
}

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

interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  patient_type: string;
  insurance_carrier?: string;
  member_id?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
}

class AdminService {
  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem("admin_session") === "true";
  }

  // Admin logout
  logout(): void {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_email");
    window.location.href = "/";
  }

  // Mock data for demo purposes
  private mockAppointments: Appointment[] = [
    {
      id: "1",
      patient_name: "John Smith",
      doctor: "Dr. Johnson",
      date: "2024-01-15",
      time: "09:00",
      status: "Confirmed",
      patient_type: "New",
      phone: "(555) 123-4567",
      insurance: "BlueCross"
    },
    {
      id: "2",
      patient_name: "Sarah Wilson",
      doctor: "Dr. Brown",
      date: "2024-01-16",
      time: "14:30",
      status: "Pending",
      patient_type: "Returning",
      phone: "(555) 987-6543",
      insurance: "Aetna"
    }
  ];

  private mockPatients: Patient[] = [
    {
      id: "1",
      name: "John Smith",
      dob: "1985-03-15",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      patient_type: "New",
      insurance_carrier: "BlueCross",
      member_id: "BC123456"
    },
    {
      id: "2",
      name: "Sarah Wilson",
      dob: "1990-07-22",
      phone: "(555) 987-6543",
      email: "sarah.wilson@email.com",
      patient_type: "Returning",
      insurance_carrier: "Aetna",
      member_id: "AET789012"
    }
  ];

  private mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Johnson",
      specialty: "Family Medicine",
      availability: ["09:00", "10:00", "11:00", "14:00", "15:00"]
    },
    {
      id: "2",
      name: "Dr. Brown",
      specialty: "Internal Medicine", 
      availability: ["08:00", "09:30", "11:00", "13:30", "15:00"]
    }
  ];

  // Get dashboard stats
  async getDashboardStats(): Promise<AdminStats> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    return {
      total_appointments: this.mockAppointments.length,
      confirmed_appointments: this.mockAppointments.filter(a => a.status === "Confirmed").length,
      pending_appointments: this.mockAppointments.filter(a => a.status === "Pending").length,
      total_patients: this.mockPatients.length,
      new_patients: this.mockPatients.filter(p => p.patient_type === "New").length,
      returning_patients: this.mockPatients.filter(p => p.patient_type === "Returning").length
    };
  }

  // Get appointments
  async getAppointments(): Promise<Appointment[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }
    return this.mockAppointments;
  }

  // Get patients
  async getPatients(): Promise<Patient[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }
    return this.mockPatients;
  }

  // Get doctors
  async getDoctors(): Promise<Doctor[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }
    return this.mockDoctors;
  }

  // Update appointment status
  async updateAppointmentStatus(id: string, status: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }
    
    const appointment = this.mockAppointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = status;
    }
  }
}

export const adminService = new AdminService();