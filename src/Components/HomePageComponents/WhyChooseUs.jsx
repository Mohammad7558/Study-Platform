import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../Components/ui/card";
import { FaChalkboardTeacher, FaUsers, FaClock } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:pt-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Collaborative Study Platform?
            </h2>
            <p className="max-w-3xl text-muted-foreground md:text-xl/relaxed">
              We bring learners, tutors, and study enthusiasts together in one powerful and flexible space — designed for effective learning and collaboration.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <FaChalkboardTeacher className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">Expert-Led Sessions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Quality learning experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All sessions are led by experienced tutors and professionals who ensure hands-on learning.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <FaUsers className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">Peer Collaboration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Learn together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Collaborate with fellow learners through group sessions, chat, and live discussions.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:shadow-sm transition-all border-border">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <FaClock className="w-6 h-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">Flexible Scheduling</CardTitle>
              <CardDescription className="text-muted-foreground">
                Study on your terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose from a variety of study sessions that suit your pace and availability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;