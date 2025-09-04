import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import AppointmentBooking from "@/components/booking/AppointmentBooking";
import HealthChatbot from "@/components/chat/HealthChatbot";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingPageProps {
  user: User;
  session: Session;
}

const BookingPage = ({ user, session }: BookingPageProps) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'chat'>('booking');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'booking' ? 'default' : 'outline'}
                onClick={() => setActiveTab('booking')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'outline'}
                onClick={() => setActiveTab('chat')}
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Health Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'booking' ? (
          <AppointmentBooking />
        ) : (
          <div className="max-w-4xl mx-auto">
            <HealthChatbot />
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;