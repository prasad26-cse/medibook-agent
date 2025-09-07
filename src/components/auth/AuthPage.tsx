import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, UserPlus, LogIn } from "lucide-react";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (formData: FormData) => {
    setLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const dob = formData.get("dob") as string;
    const patientType = formData.get("patientType") as string;

    // Step 1: Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/booking`,
      },
    });

    if (signUpError) {
      toast({
        title: "Sign up failed",
        description: signUpError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!authData.user) {
        toast({
            title: "Sign up failed",
            description: "Could not create user. Please try again",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    // Step 2: Insert into patients table
    const { error: insertError } = await supabase.from('patients').insert([
        {
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            dob,
            patient_type: patientType,
        },
    ]);

    if (insertError) {
        toast({
            title: "Error completing profile",
            description: `Your account was created, but we failed to save your profile data. Please contact support. Error: ${insertError.message}`,
            variant: "destructive",
        });
    } else {
        toast({
            title: "Account created!",
            description: "Please check your email to verify your account and complete the process.",
        });
    }

    setLoading(false);
  };

  const handleSignIn = async (formData: FormData) => {
    setLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Hardcoded admin check
    if (email === "admin@clinic.com" && password === "Admin@1234") {
      localStorage.setItem("admin_session", "true");
      localStorage.setItem("admin_email", email);
      window.location.href = "/admin-dashboard";
      setLoading(false);
      return;
    }

    // Regular user authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else if (data.user) {
        window.location.href = "/booking";
      toast({
        title: "Sign in successful",
        description: "Welcome back!"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-medical-coral/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-medical-coral rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-medical-coral bg-clip-text text-transparent">
              MedSchedule
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your smart medical appointment assistant
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSignIn(formData);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSignIn(formData);
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@clinic.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <strong>Admin Access:</strong> Use admin@clinic.com with password Admin@1234
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Admin Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSignUp(formData);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientType">Patient Type</Label>
                  <select
                    id="patientType"
                    name="patientType"
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="new">New Patient</option>
                    <option value="returning">Returning Patient</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-medical-coral to-accent hover:from-accent hover:to-medical-coral transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
