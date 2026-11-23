import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ed] flex font-sans antialiased text-[#2c1b15]">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          setMobileOpen={setMobileOpen}
          toggleSidebarCollapse={() => setCollapsed(!collapsed)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1500px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
