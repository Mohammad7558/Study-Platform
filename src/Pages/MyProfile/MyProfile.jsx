import React from "react";
import useAuth from "../../Hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, User, CalendarDays } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MyProfile = () => {
  const { user } = useAuth();
  console.log(user);


  // fallback initials
  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto shadow-lg rounded-2xl border">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <Avatar className="h-28 w-28 border-4 border-primary shadow-md">
            <AvatarImage src={user?.photoURL} alt={user?.displayName} />
            <AvatarFallback className="text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Basic Info */}
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-semibold">
              {user?.displayName || "User Name"}
            </CardTitle>
            <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start mt-1">
              <Mail className="h-4 w-4" /> {user?.email || "example@email.com"}
            </p>
          </div>
        </CardHeader>

        <Separator />

        {/* Details */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {user?.phoneNumber || "Phone not provided"}
            </span>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Member Since:{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
