import { supabase } from "@/integrations/supabase/client";

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

    try {
      // Get appointments count
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status');

      if (appointmentsError) throw appointmentsError;

      // Get patients count
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, patient_type');

      if (patientsError) throw patientsError;

      const totalAppointments = appointments?.length || 0;
      const confirmedAppointments = appointments?.filter(a => a.status === 'confirmed').length || 0;
      const pendingAppointments = appointments?.filter(a => a.status === 'pending').length || 0;
      const totalPatients = patients?.length || 0;
      const newPatients = patients?.filter(p => p.patient_type === 'new').length || 0;
      const returningPatients = patients?.filter(p => p.patient_type === 'returning').length || 0;

      return {
        total_appointments: totalAppointments,
        confirmed_appointments: confirmedAppointments,
        pending_appointments: pendingAppointments,
        total_patients: totalPatients,
        new_patients: newPatients,
        returning_patients: returningPatients
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if database query fails
      return {
        total_appointments: 0,
        confirmed_appointments: 0,
        pending_appointments: 0,
        total_patients: 0,
        new_patients: 0,
        returning_patients: 0
      };
    }
  }

  // Get appointments
  async getAppointments(): Promise<Appointment[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          status,
          is_new_patient,
          notes,
          patients!inner(first_name, last_name, phone, insurance_carrier),
          doctors!inner(name)
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      return data?.map(apt => ({
        id: apt.id,
        patient_name: `${(apt.patients as any)?.first_name || ''} ${(apt.patients as any)?.last_name || ''}`.trim() || 'Unknown Patient',
        doctor: (apt.doctors as any)?.name || 'Unknown Doctor',
        date: new Date(apt.start_time).toLocaleDateString(),
        time: new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1),
        patient_type: apt.is_new_patient ? 'New' : 'Returning',
        phone: (apt.patients as any)?.phone,
        insurance: (apt.patients as any)?.insurance_carrier
      })) || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  // Get patients
  async getPatients(): Promise<Patient[]> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(patient => ({
        id: patient.id,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown',
        dob: patient.dob || '',
        phone: patient.phone || '',
        email: patient.email,
        patient_type: patient.patient_type || 'new',
        insurance_carrier: patient.insurance_carrier,
        member_id: patient.member_id
      })) || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
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
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: status.toLowerCase() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();