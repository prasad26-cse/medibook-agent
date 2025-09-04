import { useState, useEffect } from "react";
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

const Dashboard = ({ user, session }: DashboardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        navigate('/booking?tab=chat');
        break;
      case 'profile':
        toast({
          title: "Profile Management",
          description: "Profile editing coming soon! (Free tier feature)",
        });
        break;
      case 'forms':
        toast({
          title: "Medical Forms",
          description: "Form management coming soon! (Free tier feature)",
        });
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
            Welcome back, {user.user_metadata?.first_name || user.email}!
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
              <div className="text-3xl font-bold text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">No appointments scheduled</p>
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
      </main>
    </div>
  );
};

export default Dashboard;