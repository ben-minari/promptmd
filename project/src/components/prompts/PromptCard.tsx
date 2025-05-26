import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, ThumbsUp, MessageSquare, MoreHorizontal, User } from 'lucide-react';
import { usePrompt } from '../../context/PromptContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Tool } from '../../types';

interface PromptCardProps {
  tool: Tool;
  showActions?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ tool, showActions = true }) => {
  const { saveTool, rateTool } = usePrompt();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save tools');
      return;
    }
    try {
      await saveTool(tool.id!);
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please sign in to rate tools');
      return;
    }
    try {
      await rateTool(tool.id!, rating);
      toast.success('Rating submitted successfully');
    } catch (error) {
      console.error('Error rating tool:', error);
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/prompts/${tool.id}`} className="group">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-600 transition-colors duration-150">
              {tool.title}
            </h3>
          </Link>
          {showActions && (
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.specialty.map((specialty, index) => (
            <span
              key={`specialty-${index}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
            >
              {specialty}
            </span>
          ))}
          {tool.tags.useCase.map((useCase, index) => (
            <span
              key={`useCase-${index}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
            >
              {useCase}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.appModel.map((model, index) => (
            <span
              key={`model-${index}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
            >
              {model}
            </span>
          ))}
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className="flex items-center text-slate-500 hover:text-teal-600 transition-colors duration-150"
              >
                <Bookmark
                  size={18}
                  className={tool.isSaved ? 'fill-teal-500 text-teal-500' : ''}
                />
                <span className="ml-1 text-sm">{tool.saveCount}</span>
              </button>

              <button
                onClick={() => handleRate(5)}
                className="flex items-center text-slate-500 hover:text-yellow-500 transition-colors duration-150"
              >
                <Star
                  size={18}
                  className={tool.ratingAvg >= 4 ? 'fill-yellow-400 text-yellow-400' : ''}
                />
                <span className="ml-1 text-sm">
                  {tool.ratingAvg.toFixed(1)} ({tool.ratingCount})
                </span>
              </button>

              <button className="flex items-center text-slate-500 hover:text-blue-600 transition-colors duration-150">
                <MessageSquare size={18} />
                <span className="ml-1 text-sm">0</span>
              </button>
            </div>

            <div className="flex items-center text-sm text-slate-500">
              <User size={16} className="mr-1" />
              <span>Author</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCard;