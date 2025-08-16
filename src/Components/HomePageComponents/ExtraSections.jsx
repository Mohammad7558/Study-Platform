import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Clock, Award, Globe, School, Building2, Briefcase } from "lucide-react"

export default function ExtraSections() {
  // Company data with reliable fallbacks
  const companies = [
    {
      name: "Google",
      logo: (
        <div className="flex items-center justify-center w-full h-10 bg-background rounded border p-2">
          <span className="font-bold text-foreground/80">Google</span>
        </div>
      )
    },
    {
      name: "Microsoft",
      logo: (
        <div className="flex items-center justify-center w-full h-10 bg-background rounded border p-2">
          <span className="font-bold text-foreground/80">Microsoft</span>
        </div>
      )
    },
    {
      name: "Harvard",
      logo: (
        <div className="flex items-center justify-center w-full h-12 bg-background rounded border p-2">
          <School className="h-6 w-6 text-foreground/80 mr-2" />
          <span className="font-bold text-foreground/80">Harvard</span>
        </div>
      )
    },
    {
      name: "Apple",
      logo: (
        <div className="flex items-center justify-center w-full h-10 bg-background rounded border p-2">
          <span className="font-bold text-foreground/80">Apple</span>
        </div>
      )
    },
    {
      name: "Cambridge",
      logo: (
        <div className="flex items-center justify-center w-full h-12 bg-background rounded border p-2">
          <Building2 className="h-6 w-6 text-foreground/80 mr-2" />
          <span className="font-bold text-foreground/80">Cambridge</span>
        </div>
      )
    },
    {
      name: "IBM",
      logo: (
        <div className="flex items-center justify-center w-full h-10 bg-background rounded border p-2">
          <Briefcase className="h-6 w-6 text-foreground/80 mr-2" />
          <span className="font-bold text-foreground/80">IBM</span>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-20">
      {/* =================== Impact Statistics Section =================== */}
      <section className="bg-gradient-to-b from-muted/50 to-background lg:py-14 pt-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Measurable results that demonstrate our educational effectiveness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat 1 */}
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
                  From 50+ countries worldwide, creating global connections
                </p>
              </CardContent>
            </Card>

            {/* Stat 2 */}
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
                  Industry leaders with proven teaching methodologies
                </p>
              </CardContent>
            </Card>

            {/* Stat 3 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">1,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Courses Completed</p>
                <p className="text-sm text-muted-foreground">
                  With a 98% student satisfaction rate
                </p>
              </CardContent>
            </Card>

            {/* Stat 4 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-4xl font-extrabold">10,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Learning Hours</p>
                <p className="text-sm text-muted-foreground">
                  Equivalent to 416 days of continuous education
                </p>
              </CardContent>
            </Card>

            {/* Stat 5 */}
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
                  Of students achieving their learning goals
                </p>
              </CardContent>
            </Card>

            {/* Stat 6 */}
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
                  Where our learning community thrives
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =================== Trusted By Section =================== */}
      <section className="py-5 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:mb-16 mb-8">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Trusted by Top Institutions Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized by leading universities and innovative companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="group relative flex justify-center">
                <div className="flex items-center justify-center w-full h-12">
                  {company.logo}
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
                  {company.name} {['Harvard', 'Cambridge'].includes(company.name) ? 'University' : ''}
                </span>
              </div>
            ))}
          </div>
          
          {/* Testimonial */}
          <div className="max-w-4xl mx-auto mt-16 bg-muted/50 rounded-xl p-8 border">
            <blockquote className="text-center">
              <p className="text-lg italic mb-4">
                "The quality of instruction and curriculum design has significantly enhanced our corporate training outcomes, with measurable improvements in employee performance."
              </p>
              <footer className="font-medium">
                — Dr. Emily Chen, Director of Learning Innovation at Stanford University
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  )
}