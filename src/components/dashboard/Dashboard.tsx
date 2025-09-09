import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, User as UserIcon, FileText, Bell, LogOut, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user: User;
  session: Session;
}

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  doctor_name: string;
  notes?: string;
}
const Dashboard = ({ user, session }: DashboardProps) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAppointments();
  }, [user.id]);

  const fetchUserAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          end_time,
          status,
          notes,
          doctors!inner(name)
        `)
        .eq('patient_id', user.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      const formattedAppointments = data?.map(apt => ({
        id: apt.id,
        start_time: apt.start_time,
        end_time: apt.end_time,
        status: apt.status,
        doctor_name: (apt.doctors as any)?.name || 'Unknown Doctor',
        notes: apt.notes
      })) || [];

      setAppointments(formattedAppointments);
      
      // Count upcoming appointments (future dates)
      const now = new Date();
      const upcoming = formattedAppointments.filter(apt => 
        new Date(apt.start_time) > now && apt.status !== 'cancelled'
      );
      setUpcomingCount(upcoming.length);

    } catch (error) {
      console.error('Error in fetchUserAppointments:', error);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleCardClick = (component: string) => {
    switch (component) {
      case 'booking':
        navigate('/booking');
        break;
      case 'chat':
        navigate('/health-chat');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'forms':
        navigate('/view-form');
        break;
      default:
        break;
    }
  };

  const dashboardCards = [
    {
      title: "Book Appointment",
      description: "Schedule your next medical appointment (Free Tier)",
      icon: Calendar,
      color: "from-primary to-primary-glow",
      action: "Book Now",
      component: "booking"
    },
    {
      title: "My Profile", 
      description: "Update your personal and insurance information",
      icon: UserIcon,
      color: "from-medical-coral to-accent",
      action: "View Profile",
      component: "profile"
    },
    {
      title: "Medical Forms",
      description: "Complete intake forms and view your documents",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      action: "View Forms",
      component: "forms"
    },
    {
      title: "Health Assistant",
      description: "Chat with our AI health assistant (Free Tier)",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-600",
      action: "Start Chat",
      component: "chat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-medical-coral rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-medical-coral bg-clip-text text-transparent">
                MedSchedule
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                disabled={loading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`.trim() : user.email}!
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to manage your healthcare appointments?
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/95 backdrop-blur-sm hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full group-hover:scale-105 transition-transform duration-200"
                  variant="outline"
                  onClick={() => handleCardClick(card.component)}
                >
                  {card.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">{upcomingCount}</div>
              <p className="text-sm text-muted-foreground">
                {upcomingCount === 0 ? 'No appointments scheduled' : 'Scheduled appointments'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-medical-coral/10 to-accent/10 border-medical-coral/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-medical-coral">Pending Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-medical-coral mb-1">0</div>
              <p className="text-sm text-muted-foreground">All forms completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">98%</div>
              <p className="text-sm text-muted-foreground">Excellent health management</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        {appointments.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Your Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{appointment.doctor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.start_time).toLocaleDateString()} at{' '}
                          {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
