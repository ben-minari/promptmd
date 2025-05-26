import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  className = '',
  icon = <Plus size={24} />,
  label,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        fixed bottom-6 right-6
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-teal-600 text-white
        shadow-lg hover:bg-teal-700
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {label && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-sm rounded whitespace-nowrap">
              {label}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default FloatingActionButton; 