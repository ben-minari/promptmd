import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, BookMarked, User, Heart, Award, Layers } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/browse', icon: <Search size={20} />, label: 'Browse' },
    { path: '/create', icon: <PlusCircle size={20} />, label: 'Create Prompt' },
    { path: '/profile', icon: <User size={20} />, label: 'My Profile' },
  ];

  const categories = [
    { icon: <BookMarked size={18} />, label: 'Documentation' },
    { icon: <Layers size={18} />, label: 'Diagnosis Support' },
    { icon: <Heart size={18} />, label: 'Patient Education' },
    { icon: <Award size={18} />, label: 'Best Practices' },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed z-40 top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Navigation</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out
                ${isActive(item.path) 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'}
              `}
            >
              <span className={`mr-3 ${isActive(item.path) ? 'text-teal-500' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/browse?category=${encodeURIComponent(category.label)}`}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-teal-600"
            >
              <span className="mr-3 text-slate-400">{category.icon}</span>
              {category.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-800 mb-2">Need help?</h3>
          <p className="text-xs text-slate-500 mb-3">
            Check out our guide on creating effective healthcare prompts.
          </p>
          <a 
            href="#" 
            className="text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            View Guide →
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;