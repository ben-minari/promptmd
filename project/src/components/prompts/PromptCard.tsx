import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, ThumbsUp, MessageSquare, MoreHorizontal, User } from 'lucide-react';
import { usePrompt } from '../../context/PromptContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface PromptCardProps {
  prompt: any;
  showActions?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, showActions = false }) => {
  const { savePrompt, getSavedPrompts } = usePrompt();
  const { user } = useAuth();
  const savedPrompts = getSavedPrompts();
  const isSaved = savedPrompts.some(p => p.id === prompt.id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to save prompts');
      return;
    }
    
    await savePrompt(prompt.id);
    toast.success(isSaved ? 'Removed from saved prompts' : 'Added to saved prompts');
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'Clinician':
        return <User className="h-4 w-4 text-teal-500" />;
      case 'Administrator':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <Link to={`/prompts/${prompt.id}`} className="block">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{prompt.title}</h3>
          <p className="text-sm text-slate-600 mb-3">{truncateText(prompt.description, 120)}</p>
          
          {prompt.sources && prompt.sources.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {prompt.sources.map((source: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
              {prompt.category}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {prompt.specialty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {prompt.tools.map((tool: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {getUserTypeIcon(prompt.author.type)}
          </div>
          <img 
            src={prompt.author.avatar} 
            alt={prompt.author.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-xs text-slate-600">{prompt.author.name}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{prompt.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="flex items-center text-slate-500">
            <Bookmark className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{prompt.usage_count || 0}</span>
          </div>
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-full ${
              isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
            }`}
            aria-label="Save prompt"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          
          {showActions && (
            <div className="relative inline-block text-left">
              <button 
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;