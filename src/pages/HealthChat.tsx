
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HealthChatbot from "@/components/chat/HealthChatbot";
import { User } from "@supabase/supabase-js";

interface HealthChatProps {
    user: User;
}

const HealthChat = ({ user }: HealthChatProps) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto mb-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>
            <div className="max-w-3xl mx-auto">
                <HealthChatbot user={user} />
            </div>
        </div>
    );
};

export default HealthChat;
