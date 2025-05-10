import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Search, Menu, X, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SubmitPromptModal from '../prompts/SubmitPromptModal';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSubmitClick = () => {
    if (!user) {
      navigate('/auth');
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Stethoscope className="h-8 w-8 text-teal-600" />
                <span className="ml-2 text-xl font-semibold text-slate-800">PromptMD</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-150"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/browse" 
                className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Browse
              </Link>
              <button
                onClick={handleSubmitClick}
                className="flex items-center text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Create a Prompt
              </button>
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <Link to="/profile" className="flex items-center text-slate-600 hover:text-teal-600">
                      <span className="text-sm font-medium mr-1">My Profile</span>
                      <User className="h-5 w-5" />
                    </Link>
                    <button 
                      onClick={signOut}
                      className="flex items-center text-slate-600 hover:text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                  Sign In
                </Link>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <Link 
              to="/browse" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-teal-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSubmitClick();
              }}
              className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Create a Prompt
            </button>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-teal-600 hover:bg-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-red-600 hover:bg-slate-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <SubmitPromptModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
};

export default Navbar;