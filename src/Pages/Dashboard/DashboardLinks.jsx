import {
  BookIcon,
  BookOpenIcon,
  ClipboardListIcon,
  FileUpIcon,
  FolderOpenIcon,
  HomeIcon,
  PlusIcon,
  StickyNoteIcon,
  XCircleIcon,
  UsersIcon,
} from "lucide-react";
import { NavLink } from "react-router";
import useUserRole from "../../Hooks/useUserRole";
import { cn } from "../../lib/utils";

const DashboardLinks = () => {
  const { role, loading } = useUserRole();

  if (loading) return <p className="text-center text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-1 px-4">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
          )
        }
      >
        <HomeIcon className="h-4 w-4" />
        Home
      </NavLink>

      {/* Student-only links */}
      {role === "student" && (
        <>
          <NavLink
            to="/dashboard/booked-sessions"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <ClipboardListIcon className="h-4 w-4" />
            Booked Sessions
          </NavLink>
          <NavLink
            to="/dashboard/create-note"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <StickyNoteIcon className="h-4 w-4" />
            Create Note
          </NavLink>
          <NavLink
            to="/dashboard/manage-notes"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <StickyNoteIcon className="h-4 w-4" />
            Manage Notes
          </NavLink>
          <NavLink
            to="/dashboard/all-study-met"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <BookOpenIcon className="h-4 w-4" />
            View Materials
          </NavLink>
        </>
      )}

      {/* Tutor-only links */}
      {role === "tutor" && (
        <>
          <NavLink
            to="/dashboard/create-session"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <PlusIcon className="h-4 w-4" />
            Create Session
          </NavLink>
          <NavLink
            to="/dashboard/my-session"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <BookOpenIcon className="h-4 w-4" />
            My Sessions
          </NavLink>
          <NavLink
            to="/dashboard/upload-materials"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <FileUpIcon className="h-4 w-4" />
            Upload Materials
          </NavLink>
          <NavLink
            to="/dashboard/view-materials"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <FolderOpenIcon className="h-4 w-4" />
            View Materials
          </NavLink>
          <NavLink
            to="/dashboard/rejected-feedback"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <XCircleIcon className="h-4 w-4" />
            Rejected Feedback
          </NavLink>
        </>
      )}

      {/* Admin-only links */}
      {role === "admin" && (
        <>
          <NavLink
            to="/dashboard/all-users"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <UsersIcon className="h-4 w-4" />
            All Users
          </NavLink>
          <NavLink
            to="/dashboard/all-sessions"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <ClipboardListIcon className="h-4 w-4" />
            All Sessions
          </NavLink>
          <NavLink
            to="/dashboard/all-materials"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <BookIcon className="h-4 w-4" />
            All Materials
          </NavLink>
        </>
      )}
    </div>
  );
};

export default DashboardLinks;