import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-gray-100';

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
            >
              Tuition Manager
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                '/'
              )}`}
            >
              Dashboard
            </Link>
            <Link
              to="/add-student"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                '/add-student'
              )}`}
            >
              Add Student
            </Link>
            <Link
              to="/add-payment"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(
                '/add-payment'
              )}`}
            >
              Record Payment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
