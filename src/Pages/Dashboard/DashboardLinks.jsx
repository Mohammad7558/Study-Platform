import {
  FaBook,
  FaBookOpen,
  FaClipboardList,
  FaFileUpload,
  FaFolderOpen,
  FaHome,
  FaPlus,
  FaStickyNote,
  FaTimesCircle,
  FaUserFriends,
} from "react-icons/fa";
import { NavLink } from "react-router";
import useUserRole from "../../Hooks/useUserRole";

const DashboardLinks = () => {
  const { role, loading } = useUserRole();

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <nav className="space-y-2">
      <NavLink to="/dashboard" className={linkStyle}>
        <FaHome /> Home
      </NavLink>

      {/* Student-only links */}
      {role === "student" && (
        <>
          <NavLink to="/dashboard/booked-sessions" className={linkStyle}>
            <FaClipboardList /> Booked Sessions
          </NavLink>
          <NavLink to="/dashboard/create-note" className={linkStyle}>
            <FaStickyNote /> Create Note
          </NavLink>
          <NavLink to="/dashboard/manage-notes" className={linkStyle}>
            <FaStickyNote /> Manage Note
          </NavLink>
          <NavLink to="/dashboard/all-study-met" className={linkStyle}>
            <FaStickyNote />
            View Materials
          </NavLink>
        </>
      )}

      {/* Tutor-only links */}
      {role === "tutor" && (
        <>
          <NavLink to="/dashboard/create-session" className={linkStyle}>
            <FaPlus /> Create Session
          </NavLink>
          <NavLink to="/dashboard/my-session" className={linkStyle}>
            <FaBookOpen /> My Sessions
          </NavLink>
          <NavLink to="/dashboard/upload-materials" className={linkStyle}>
            <FaFileUpload /> Upload Materials
          </NavLink>
          <NavLink to="/dashboard/view-materials" className={linkStyle}>
            <FaFolderOpen /> View Materials
          </NavLink>
          <NavLink to="/dashboard/rejected-feedback" className={linkStyle}>
            <FaTimesCircle /> Rejected Feedback
          </NavLink>
        </>
      )}

      {/* Admin-only links */}
      {role === "admin" && (
        <>
          <NavLink to="/dashboard/all-users" className={linkStyle}>
            <FaUserFriends /> All Users
          </NavLink>
          <NavLink to="/dashboard/all-sessionss" className={linkStyle}>
            <FaClipboardList /> All Sessions
          </NavLink>
          <NavLink to="/dashboard/all-materials" className={linkStyle}>
            <FaBook /> All Materials
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default DashboardLinks;

const linkStyle = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-md transition text-sm ${
    isActive
      ? "bg-cyan-600 text-white"
      : "hover:bg-gray-800 hover:text-cyan-400"
  }`;
