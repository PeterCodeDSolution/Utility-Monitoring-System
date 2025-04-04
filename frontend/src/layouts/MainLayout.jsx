import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiEdit, FiMap, FiLogOut, FiMenu, FiX, FiCamera } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

const MainLayout = () => {
  const { currentUser, logout, isOperator, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome className="text-lg" /> },
    {
      to: '/data-input',
      label: 'Data Input',
      icon: <FiEdit className="text-lg" />,
      restricted: !isOperator && !isAdmin,
    },
    { to: '/site-map', label: 'Site Map', icon: <FiMap className="text-lg" /> },
    { to: '/qr-test', label: 'QR Test', icon: <FiCamera className="text-lg" /> },
  ];

  const activeLinkStyle = ({ isActive }) =>
    clsx(
      'flex items-center gap-2 py-2 px-4 rounded-md transition-colors',
      isActive
        ? 'bg-primary-600 text-white font-medium'
        : 'text-gray-700 hover:bg-gray-100'
    );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          'w-64 bg-white shadow-md p-4 fixed inset-y-0 left-0 z-10 transition-transform lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8 mt-2">
            <h1 className="text-xl font-bold text-primary-600">Utility Monitor</h1>
            <p className="text-sm text-gray-600 mt-1">Industrial Park Management</p>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map(
              (item) =>
                !item.restricted && (
                  <NavLink key={item.to} to={item.to} className={activeLinkStyle}>
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                )
            )}
          </nav>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {currentUser?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{currentUser?.username || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors w-full"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout; 