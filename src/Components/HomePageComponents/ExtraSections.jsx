import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Clock, Award, Globe } from "lucide-react"

export default function ExtraSections() {
  return (
    <div className="space-y-20">
      {/* =================== Impact Statistics Section =================== */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Transforming Education Through Numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our measurable impact on students' learning journeys across the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat 1 - Enhanced */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">5,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Students Enrolled</p>
                <p className="text-sm text-muted-foreground">
                  From 50+ countries, creating a diverse learning community
                </p>
              </CardContent>
            </Card>

            {/* Stat 2 - Enhanced */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">200+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Expert Tutors</p>
                <p className="text-sm text-muted-foreground">
                  Industry professionals with 10+ years average experience
                </p>
              </CardContent>
            </Card>

            {/* Stat 3 - Enhanced */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">1,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Study Sessions</p>
                <p className="text-sm text-muted-foreground">
                  98% satisfaction rate across all learning activities
                </p>
              </CardContent>
            </Card>

            {/* New Stat 4 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">10,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Hours Tutored</p>
                <p className="text-sm text-muted-foreground">
                  Equivalent to 416 days of continuous learning
                </p>
              </CardContent>
            </Card>

            {/* New Stat 5 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">95%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Success Rate</p>
                <p className="text-sm text-muted-foreground">
                  Of students achieving their learning objectives
                </p>
              </CardContent>
            </Card>

            {/* New Stat 6 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">50+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Countries</p>
                <p className="text-sm text-muted-foreground">
                  Where our students and tutors are located worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =================== Trusted By Section =================== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Trusted by Learners & Organizations Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of students and professionals from leading institutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Enhanced logos with tooltips on hover */}
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/google-2015.svg" 
                alt="Google" 
                className="h-10 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                Google Employees
              </span>
            </div>
            
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/microsoft.svg" 
                alt="Microsoft" 
                className="h-10 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                Microsoft Teams
              </span>
            </div>
            
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/harvard-university-1.svg" 
                alt="Harvard" 
                className="h-12 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                Harvard Students
              </span>
            </div>
            
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/apple-14.svg" 
                alt="Apple" 
                className="h-10 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                Apple Developers
              </span>
            </div>
            
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/university-of-cambridge.svg" 
                alt="Cambridge" 
                className="h-12 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                Cambridge Alumni
              </span>
            </div>
            
            <div className="group relative">
              <img 
                src="https://cdn.worldvectorlogo.com/logos/ibm-2.svg" 
                alt="IBM" 
                className="h-10 mx-auto opacity-70 group-hover:opacity-100 transition duration-300" 
              />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                IBM Professionals
              </span>
            </div>
          </div>
          
          {/* Testimonial snippet */}
          <div className="max-w-4xl mx-auto mt-16 bg-muted/50 rounded-xl p-8 border">
            <blockquote className="text-center">
              <p className="text-lg italic mb-4">
                "This platform transformed our employee training program. We've seen a 40% increase in skill retention compared to traditional methods."
              </p>
              <footer className="font-medium">
                — Sarah Johnson, Learning & Development Director at Microsoft
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  )
}