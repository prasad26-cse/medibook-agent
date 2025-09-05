import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, UserCheck, Activity, LogOut, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/adminApi";
import AppointmentsTable from "./AppointmentsTable";
import PatientsTable from "./PatientsTable";
import DoctorsSchedule from "./DoctorsSchedule";

interface DashboardStats {
  total_appointments: number;
  confirmed_appointments: number;
  pending_appointments: number;
  total_patients: number;
  new_patients: number;
  returning_patients: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    verifyAdminAndLoadData();
  }, []);

  const verifyAdminAndLoadData = async () => {
    const verifyResult = await adminApi.verifyAdmin();
    if (verifyResult.error) {
      toast({
        title: "Authentication Error",
        description: "Please log in as admin",
        variant: "destructive"
      });
      localStorage.removeItem("admin_token");
      window.location.href = "/";
      return;
    }

    await loadDashboardData();
  };

  const loadDashboardData = async () => {
    setLoading(true);
    const result = await adminApi.getDashboardStats();
    if (result.data) {
      setStats(result.data);
    } else {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-medical-coral/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-medical-coral rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-medical-coral rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical-coral bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadDashboardData}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: Activity },
                { id: "appointments", label: "Appointments", icon: Calendar },
                { id: "patients", label: "Patients", icon: Users },
                { id: "doctors", label: "Doctors", icon: UserCheck },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Total Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats?.total_appointments || 0}</div>
                  <p className="text-sm text-muted-foreground">All scheduled appointments</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-700 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Confirmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700">{stats?.confirmed_appointments || 0}</div>
                  <p className="text-sm text-muted-foreground">Confirmed appointments</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-medical-coral/10 to-accent/10 border-medical-coral/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-medical-coral flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-medical-coral">{stats?.total_patients || 0}</div>
                  <p className="text-sm text-muted-foreground">Registered patients</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-700 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    New Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700">{stats?.new_patients || 0}</div>
                  <p className="text-sm text-muted-foreground">First-time patients</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => setActiveTab("appointments")} 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Manage Appointments</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab("patients")} 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Users className="w-6 h-6" />
                  <span>View Patients</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab("doctors")} 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <UserCheck className="w-6 h-6" />
                  <span>Doctor Schedules</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "appointments" && <AppointmentsTable />}
        {activeTab === "patients" && <PatientsTable />}
        {activeTab === "doctors" && <DoctorsSchedule />}
      </main>
    </div>
  );
};

export default AdminDashboard;