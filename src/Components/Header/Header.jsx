import React, { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { Link } from "react-router";
import useAuth from "../../Hooks/useAuth";

const Header = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-5 md:px-0 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-cyan-400">
            <Link to="/">My Website</Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-cyan-400 transition">
              About
            </Link>
            <Link to="/all-session" className="hover:text-cyan-400 transition">
              All Sessions
            </Link>
            <Link to="/all-tutors" className="hover:text-cyan-400 transition">
              Tutors
            </Link>

            {user ? (
              <>
              <Link to='/dashboard'>Dashboard</Link>
                <div className="flex items-center gap-3 ml-4">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="user"
                      className="w-8 h-8 rounded-full border-2 border-cyan-600"
                    />
                  )}
                  <span className="text-sm text-white">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block mt-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block mt-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition text-center"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? <BiX size={28} /> : <BiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-cyan-400"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block hover:text-cyan-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block hover:text-cyan-400"
          >
            Contact
          </Link>
          <Link to='/dashboard'>Dashboard</Link>

          {user ? (
            <>
              <div className="flex items-center gap-3 mt-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="user"
                    className="w-8 h-8 rounded-full border-2 border-cyan-600"
                  />
                )}
                <span className="text-sm">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full mt-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block mt-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition text-center"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block mt-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
