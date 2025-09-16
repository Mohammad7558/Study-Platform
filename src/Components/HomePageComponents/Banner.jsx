import React from "react";
import img from "../../assets/Banner.jpg";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router";
import { BookOpen, Users, Target, ArrowRight } from "lucide-react";

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between py-12 lg:py-20 gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-black/5 text-black px-4 py-2 rounded-full text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              <span>Premium Study Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-tight">
                Empower Your
                <span className="block bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join our Collaborative Study Platform to connect with mentors,
                explore resources, and grow your skills in a vibrant learning
                community designed for academic excellence.
              </p>
            </div>

            {/* Feature Points */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>100+ Mentors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Personal Guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>All Subjects</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/all-sessions">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start items-center gap-8 pt-4 text-black">
              <div className="text-center">
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-gray-500">Satisfied</div>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 relative px-5">
            {/* Image Container with Decorative Elements */}
            <div className="relative">
              {/* Decorative border */}
              <div className="absolute -inset-4 bg-gradient-to-r from-black/10 to-gray-300/30 rounded-2xl blur-xl"></div>
              
              {/* Main Image */}
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <img
                  src={img}
                  alt="Collaborative learning platform"
                  className="w-full h-auto rounded-xl object-cover"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-lg font-semibold shadow-lg">
                  🎓 Premium Courses
                </div>
                
                {/* Bottom Stats Card */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-black">95% Success</div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Grid Pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #000 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Banner;