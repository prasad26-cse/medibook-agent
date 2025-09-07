import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ProfileProps {
  user: User | null;
}

const ProfilePage = ({ user }: ProfileProps) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    dob,
    address,
    gender,
  } = user.user_metadata;

  const getInitials = (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.user_metadata.avatar_url} alt={`${first_name} ${last_name}`} />
              <AvatarFallback>{getInitials(first_name, last_name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{`${first_name} ${last_name}`}</CardTitle>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={first_name || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={last_name || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={dob || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" value={gender || ""} disabled />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
