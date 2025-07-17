import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../Components/ui/card";
import { Mail, Phone, Clock, MapPin, MessageSquare, User } from "lucide-react";
import { Separator } from "../../Components/ui/separator";
import { Badge } from "../../Components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/ui/avatar";

export const ContactForm = () => {
  return (
    <div className="lg:mt-32 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Contact Our Team
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help with any questions about our study platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out through any of these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    support@studypath.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    admissions@studypath.com
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Education Street
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Boston, MA 02108
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4 mt-5">
                <Avatar>
                  <AvatarImage src="/avatars/support-team.png" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Support Team</p>
                  <p className="text-xs text-muted-foreground">
                    Typically replies within 1 hour
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Contact Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form and we'll get back to you shortly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none"
                      >
                        Full Name
                      </label>
                    </div>
                    <Input id="name" placeholder="Your name" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none"
                      >
                        Email
                      </label>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none"
                  >
                    Subject
                  </label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none"
                    >
                      Message
                    </label>
                  </div>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="newsletter" className="h-4 w-4" />
                  <label
                    htmlFor="newsletter"
                    className="text-sm text-muted-foreground"
                  >
                    Subscribe to our newsletter
                  </label>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Our Support Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Student Support",
                email: "sarah@studypath.com",
              },
              {
                name: "Michael Chen",
                role: "Technical Support",
                email: "michael@studypath.com",
              },
              {
                name: "Emma Rodriguez",
                role: "Admissions",
                email: "emma@studypath.com",
              },
            ].map((person, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={`/avatars/team-${index + 1}.png`} />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {person.role}
                    </p>
                    <p className="text-sm text-primary mt-2">{person.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};