// DashboardLinks.jsx
import React from "react";
import { NavLink } from "react-router";
import {
  FaHome,
  FaBook,
  FaPlus,
  FaStickyNote,
  FaFileUpload,
  FaFolderOpen,
  FaUserFriends,
  FaTimesCircle,
  FaBookOpen,
  FaClipboardList,
  FaBookReader,
} from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Home", icon: <FaHome /> },
  { to: "/dashboard/booked-sessions", label: "Booked Sessions", icon: <FaClipboardList /> },
  { to: "/dashboard/create-note", label: "Create Note", icon: <FaStickyNote /> },
  { to: "/dashboard/study-materials", label: "Study Materials", icon: <FaBook /> },
  { to: "/dashboard/session-detail/:id", label: "Session Detail", icon: <FaBookReader /> },
  { to: "/dashboard/create-session", label: "Create Session", icon: <FaPlus /> },
  { to: "/dashboard/my-sessions", label: "My Sessions", icon: <FaBookOpen /> },
  { to: "/dashboard/upload-materials", label: "Upload Materials", icon: <FaFileUpload /> },
  { to: "/dashboard/view-materials", label: "View Materials", icon: <FaFolderOpen /> },
  { to: "/dashboard/rejected-feedback", label: "Rejected Feedback", icon: <FaTimesCircle /> },
  { to: "/dashboard/all-users", label: "All Users", icon: <FaUserFriends /> },
  { to: "/dashboard/all-sessions", label: "All Sessions", icon: <FaClipboardList /> },
  { to: "/dashboard/all-materials", label: "All Materials", icon: <FaBook /> },
];

const DashboardLinks = () => {
  return (
    <nav className="space-y-2">
      {links.map(({ to, label, icon }, index) => (
        <NavLink
          key={index}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition text-sm ${
              isActive
                ? "bg-cyan-600 text-white"
                : "hover:bg-gray-800 hover:text-cyan-400"
            }`
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardLinks;
