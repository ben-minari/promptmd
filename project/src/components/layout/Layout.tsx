import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 p-4 md:p-6 ${user ? 'md:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;