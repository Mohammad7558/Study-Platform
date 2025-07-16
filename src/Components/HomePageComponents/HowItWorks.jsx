import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { 
  RocketIcon, 
  UsersIcon, 
  MessageSquareIcon,
  BadgeCheckIcon,
  ClockIcon,
  CalendarIcon
} from "lucide-react";
import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:pt-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Start Learning Together
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Our platform makes collaborative learning simple and effective. Follow these steps to join the community.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <RocketIcon className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">1. Sign Up</CardTitle>
              <CardDescription className="text-muted-foreground">Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Register with email or social accounts in seconds.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <UsersIcon className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">2. Join a Session</CardTitle>
              <CardDescription className="text-muted-foreground">Find your learning group</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse and join sessions matching your interests.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <MessageSquareIcon className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">3. Collaborate</CardTitle>
              <CardDescription className="text-muted-foreground">Engage with peers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Participate in live discussions and share knowledge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-sm transition-all border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <BadgeCheckIcon className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle>Verified Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn from industry professionals and vetted educators.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-all border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <ClockIcon className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle>Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sessions available around the clock to fit your schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-all border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <CalendarIcon className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitor your learning journey with detailed analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-muted border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Ready to Transform Your Learning?
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Join thousands of learners growing together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to='/all-sessions'>
              <Button className="bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
                Get Started Now
              </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;