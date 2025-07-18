import { useState } from "react";
import { Link, Outlet } from "react-router";
import { HomeIcon, LogOutIcon, MenuIcon, ChevronDownIcon } from "lucide-react";
import DashboardLinks from "../Pages/Dashboard/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import { toast } from "sonner";
import { Button } from "../Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { role } = useUserRole();

  const handleLogOut = () => {
    logOut()
    .then(() => {
      toast.success('Log Out success')
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  return (
    <div className="min-h-screen w-full ">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="sm:hidden"
              onClick={() => setIsOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium px-5 pt-10">
              <div className="flex items-center gap-4 p-2">
                <Avatar>
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.displayName || "User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                    {role}
                  </span>
                </div>
              </div>
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span>Main Home</span>
              </Link>
              <div className="text-xl font-bold text-primary">Dashboard</div>
              <DashboardLinks />
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={handleLogOut}
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-primary">Dashboard</h1>
        <Link to="/" className="ml-auto text-primary hover:text-primary/80">
          Home
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="fixed top-0 left-0 h-full max-h-screen w-64 border-r">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <span>Main Home</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                <div className="text-xl font-bold text-primary px-4 py-2">
                  Dashboard
                </div>
                <DashboardLinks />
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user?.email || "user@example.com"}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                    {role}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2" onClick={handleLogOut}>
                      <LogOutIcon className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:ml-64">
        <main className="flex-1 p-4 sm:p-6">
          <div className="h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
