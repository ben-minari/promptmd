import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PromptMD. All rights reserved.
            </p>
            <p className="flex items-center text-xs text-slate-400 mt-1">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for healthcare professionals
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-slate-500 hover:text-teal-600 transition duration-150">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-teal-600 transition duration-150">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-teal-600 transition duration-150">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;