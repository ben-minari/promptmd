import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type PromptView = 'all' | 'saved' | 'created' | 'drafts';

interface ViewSelectorProps {
  activeView: PromptView;
  onViewChange: (view: PromptView) => void;
  className?: string;
  savedCount?: number;
  createdCount?: number;
  draftsCount?: number;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  activeView,
  onViewChange,
  className = '',
  savedCount = 0,
  createdCount = 0,
  draftsCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const views: { id: PromptView; label: string; count?: number }[] = [
    { id: 'all', label: 'All Prompts' },
    { id: 'saved', label: 'Saved', count: savedCount },
    { id: 'created', label: 'Created', count: createdCount },
    { id: 'drafts', label: 'Drafts', count: draftsCount },
  ];

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <span className="text-sm font-medium text-slate-700">
          {views.find(v => v.id === activeView)?.label}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div
          className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="py-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => {
                  onViewChange(view.id);
                  setIsExpanded(false);
                }}
                className={`
                  w-full px-4 py-2 text-sm text-left
                  flex items-center justify-between
                  ${
                    activeView === view.id
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <span>{view.label}</span>
                {view.count !== undefined && (
                  <span
                    className={`
                      ml-2 px-2 py-0.5 text-xs rounded-full
                      ${
                        activeView === view.id
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-slate-100 text-slate-600'
                      }
                    `}
                  >
                    {view.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSelector; 