import axios from "axios";
import { Menu, X, ChevronDown, BookOpen, User, LogOut, LogIn, UserPlus } from "lucide-react";
import {
  FiCalendar,
  FiHome,
  FiInfo,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/ui/avatar";
import { Button } from "../../Components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../../Components/ui/sheet";
import useAuth from "../../Hooks/useAuth";

const Header = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-dropdown')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://assignment-12-server-side-swart.vercel.app/logout",
        {},
        { withCredentials: true }
      );
      await logOut();
      navigate("/login");
      setShowUserMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigationLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/about", label: "About", icon: FiInfo },
    { to: "/all-sessions", label: "Sessions", icon: FiCalendar },
    { to: "/all-tutors", label: "Tutors", icon: FiUsers },
  ];

  const NavLinks = (
    <>
      {navigationLinks.map((link) => {
        const IconComponent = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className="group relative flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black transition-all duration-300 hover:bg-gray-50/80 rounded-xl"
          >
            <IconComponent className="mr-2.5 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            {link.label}
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-black/5' 
          : 'bg-white/90 backdrop-blur-lg border-b border-gray-100/50'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-18 lg:h-20 container items-center justify-between px-4 sm:px-6 lg:px-0">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2.5 group transition-transform duration-200 hover:scale-105"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
            <BookOpen className="w-5 h-5 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            EduSphere
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-gray-50/50 rounded-2xl p-1.5">
          {NavLinks}
        </nav>

        {/* Right Side - Auth & User Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {user ? (
            <>
              {/* Desktop User Section */}
              <div className="hidden md:flex items-center space-x-3">
                

                {/* User Dropdown */}
                <div className="relative user-dropdown">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2.5 hover:bg-gray-50 rounded-xl px-3 py-2.5 h-auto"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-gray-200/60 shadow-md">
                      <AvatarImage 
                        src={user?.photoURL || user?.image} 
                        alt={user?.displayName || user?.name || "User"} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-black to-gray-800 text-white text-sm font-semibold">
                        {(user?.displayName || user?.name || user?.email || "U")[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-800 leading-tight">
                        {user?.displayName || user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user?.role || "Student"}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {/* Custom Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-50">
                        <Avatar className="h-11 w-11 ring-2 ring-gray-100">
                          <AvatarImage 
                            src={user?.photoURL || user?.image} 
                            alt={user?.displayName || user?.name || "User"} 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-black to-gray-800 text-white font-semibold">
                            {(user?.displayName || user?.name || user?.email || "U")[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.displayName || user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {user?.role || "Student"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <Link 
                          to="/dashboard" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-150"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-black rounded-xl transition-all duration-200"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Now
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-12" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[360px] bg-white/95 backdrop-blur-xl border-l border-gray-200/60 p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xl font-bold text-black">EduSphere</span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-1 p-4 flex-1">
                    {navigationLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <SheetClose key={link.to} asChild>
                          <Link
                            to={link.to}
                            className="flex items-center px-4 py-4 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <IconComponent className="mr-3 h-5 w-5" />
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>

                  {/* Mobile User Section */}
                  <div className="border-t border-gray-100 p-6">
                    {user ? (
                      <div className="space-y-4">
                        {/* User Info Card */}
                        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl">
                          <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                            <AvatarImage 
                              src={user?.photoURL || user?.image} 
                              alt={user?.displayName || user?.name || "User"} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-black to-gray-800 text-white font-semibold">
                              {(user?.displayName || user?.name || user?.email || "U")[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.displayName || user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {user?.role || "Student"}
                            </p>
                          </div>
                        </div>

                        {/* Mobile User Actions */}
                        <div className="space-y-2">
                          <SheetClose asChild>
                            <Link to="/dashboard">
                              <Button
                                variant="outline"
                                className="justify-start py-3 border-gray-200 hover:bg-gray-50 rounded-xl"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <User className="h-4 w-4" />
                                Dashboard
                              </Button>
                            </Link>
                          </SheetClose>
                          <Button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="ml-3 justify-start py-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-xl"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <SheetClose asChild>
                          <Link to="/login">
                            <Button
                              variant="outline"
                              className="w-full justify-start py-3 border-gray-200 hover:bg-gray-50 rounded-xl"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <LogIn className="mr-3 h-4 w-4" />
                              Sign In
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/register">
                            <Button 
                              className="w-full justify-start py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-xl shadow-lg"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <UserPlus className="mr-3 h-4 w-4" />
                              Join Now
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;