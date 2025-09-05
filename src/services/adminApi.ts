const API_BASE_URL = "http://localhost:8000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class AdminApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "/";
      }
      const error = await response.text();
      return { error };
    }
    const data = await response.json();
    return { data };
  }

  async verifyAdmin(): Promise<ApiResponse<{ valid: boolean; user: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }

  async getDashboardStats(): Promise<ApiResponse<{
    total_appointments: number;
    confirmed_appointments: number;
    pending_appointments: number;
    total_patients: number;
    new_patients: number;
    returning_patients: number;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }

  async getAppointments(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }

  async getPatients(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/patients`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }

  async getDoctors(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return this.handleResponse(response);
    } catch (error) {
      return { error: "Network error" };
    }
  }
}

export const adminApi = new AdminApiService();