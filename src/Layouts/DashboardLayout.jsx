import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import {
  FaHome,
  FaUserCircle,
  FaChalkboardTeacher,
  FaBookOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import DashboardLinks from '../Pages/Dashboard/DashboardLinks';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Header */}
      <header className="flex items-center justify-between bg-gray-900 text-white px-4 py-3 md:hidden">
        <button onClick={() => setIsOpen(true)}>
          <FaBars size={20} />
        </button>
        <h1 className="text-lg font-bold text-cyan-400">Dashboard</h1>
        <Link to="/" className="text-cyan-400">Home</Link>
      </header>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-gray-100 p-6 space-y-6 shadow-lg">
        <Link className='bg-white text-black p-3 rounded text-center font-semibold' to='/'>
          Main Home
        </Link>
        <div className="text-2xl font-bold text-cyan-500">Dashboard</div>
        <DashboardLinks />
        <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Sidebar Drawer for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-64 bg-gray-900 text-white p-6 space-y-6 z-50 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-cyan-400">Dashboard</div>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            <Link
              to="/"
              className="block text-black bg-white text-center py-2 rounded-md font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Main Home
            </Link>

            <DashboardLinks onLinkClick={() => setIsOpen(false)} />

            <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition w-full">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
