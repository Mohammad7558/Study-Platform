import axios from "axios";
import { Menu } from "lucide-react";
import {
  FiCalendar,
  FiHome,
  FiInfo,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router";
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

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const NavLinks = (
    <>
      <Link
        to="/"
        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary hover:underline underline-offset-4"
      >
        <FiHome className="mr-2 h-4 w-4" />
        Home
      </Link>
      <Link
        to="/about"
        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary hover:underline underline-offset-4"
      >
        <FiInfo className="mr-2 h-4 w-4" />
        About
      </Link>
      <Link
        to="/all-sessions"
        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary hover:underline underline-offset-4"
      >
        <FiCalendar className="mr-2 h-4 w-4" />
        Sessions
      </Link>
      <Link
        to="/all-tutors"
        className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary hover:underline underline-offset-4"
      >
        <FiUsers className="mr-2 h-4 w-4" />
        Tutors
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          EduSphere
        </Link>

        {/* Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center space-x-2">{NavLinks}</nav>

        {/* Right - Auth/User/Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary hover:underline underline-offset-4 flex items-center"
              >
                <FiUser className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL} />
                <AvatarFallback>
                  {user.displayName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <FiLogOut className="mr-1 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <FiLogIn className="mr-1 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="flex items-center bg-primary text-white hover:bg-primary/90"
                >
                  <FiUserPlus className="mr-1 h-4 w-4" />
                  Join Now
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 focus-visible:ring-2"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[300px] z-50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-lg font-bold text-primary p-3">
                      EduSphere
                    </span>
                  </div>

                  <div className="flex flex-col space-y-4 pt-6">{NavLinks}</div>

                  <div className="mt-auto p-4">
                    {user ? (
                      <>
                        <div className="flex items-center mb-4 space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>
                              {user.displayName?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user.displayName || user.email}
                            </p>
                          </div>
                        </div>
                        <Link to="/dashboard">
                          <Button
                            variant="outline"
                            className="w-full mb-2 flex items-center"
                          >
                            <FiUser className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full flex items-center"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <SheetClose asChild>
                          <Link to="/login">
                            <Button
                              variant="outline"
                              className="w-full flex items-center"
                            >
                              <FiLogIn className="mr-2 h-4 w-4" />
                              Sign In
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/register">
                            <Button className="w-full flex items-center">
                              <FiUserPlus className="mr-2 h-4 w-4" />
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
