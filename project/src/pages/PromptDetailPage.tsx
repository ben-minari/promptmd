import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Copy, Star } from 'lucide-react';
import { usePrompt, Prompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../context/AuthContext';
import CommentSection from '../components/comments/CommentSection';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPromptById, ratePrompt, getUserPromptRating, allPrompts, savePrompt, getSavedPrompts } = usePrompt();
  const { user } = useAuth();
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Get prompt by ID from context
  useEffect(() => {
    const prompt = getPromptById(id || '');
    if (prompt) {
      setCurrentPrompt(prompt);
    }
  }, [id, allPrompts]);

  // Get user's rating for this prompt
  useEffect(() => {
    const fetchUserRating = async () => {
      if (user && currentPrompt) {
        const rating = await getUserPromptRating(currentPrompt.id);
        setUserRating(rating);
      }
    };
    fetchUserRating();
  }, [user, currentPrompt, getUserPromptRating]);

  if (!currentPrompt) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Prompt Not Found</h1>
        <p className="text-slate-600 mb-6">The prompt you're looking for does not exist or has been removed.</p>
        <Link 
          to="/browse" 
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
        >
          Browse Prompts
        </Link>
      </div>
    );
  }

  const savedPrompts = getSavedPrompts();
  const isSaved = savedPrompts.some(p => p.id === currentPrompt.id);

  const handleSavePrompt = async () => {
    if (!user) {
      toast.error('Please sign in to save prompts');
      return;
    }
    
    try {
      await savePrompt(currentPrompt.id);
      toast.success(isSaved ? 'Removed from saved prompts' : 'Added to saved prompts');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt.content);
    setCopied(true);
    toast.success('Prompt copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleRatePrompt = async (rating: number) => {
    if (!user) {
      toast.error('Please sign in to rate prompts');
      return;
    }
    
    try {
      const updatedPrompt = await ratePrompt(currentPrompt.id, rating);
      
      // Refresh the user's rating
      const newRating = await getUserPromptRating(currentPrompt.id);
      setUserRating(newRating);
      
      console.log('Setting current prompt with:', updatedPrompt);
      setCurrentPrompt(updatedPrompt);
      
      toast.success('Thank you for your rating!');
    } catch (error) {
      console.error('Error rating prompt:', error);
      toast.error('Failed to update rating');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Link 
          to="/browse" 
          className="flex items-center text-slate-600 hover:text-teal-600 transition duration-150"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back to Browse</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header with title, description, and action buttons */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{currentPrompt.title}</h1>
              <p className="text-slate-600">{currentPrompt.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSavePrompt}
                className={`p-2 rounded-full ${
                  isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                }`}
                aria-label="Save prompt"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                onClick={handleCopyPrompt}
                className={`p-2 rounded-full ${
                  copied ? 'text-teal-500' : 'text-slate-400 hover:text-teal-500 hover:bg-slate-100'
                }`}
                aria-label="Copy prompt"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Author and metrics section */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center">
              <img 
                src={currentPrompt.author.avatar} 
                alt={currentPrompt.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-slate-800">{currentPrompt.author.name}</p>
                <p className="text-sm text-slate-500">{new Date(currentPrompt.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 mr-1" />
                <span>{currentPrompt.rating.toFixed(1)} ({currentPrompt.rating_count} ratings)</span>
              </div>
              <div className="flex items-center">
                <Bookmark className="h-4 w-4 text-slate-400 mr-1" />
                <span>{currentPrompt.usage_count} saves</span>
              </div>
            </div>
          </div>

          {/* Prompt content */}
          <div className="prose prose-slate max-w-none mb-6">
            <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto">
              <code>{currentPrompt.content}</code>
            </pre>
          </div>

          {/* Classifications section */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Classifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Category</h4>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
                  {currentPrompt.category}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Specialty</h4>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                  {currentPrompt.specialty}
                </span>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Compatible Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {currentPrompt.tools.map((tool: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sources section */}
          {currentPrompt.sources && currentPrompt.sources.length > 0 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Sources</h3>
              <div className="flex flex-wrap gap-2">
                {currentPrompt.sources.map((source: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating section */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Your Rating</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatePrompt(star)}
                  className={`p-1 rounded-full ${
                    star <= (userRating || 0) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
                  }`}
                >
                  <Star className="h-6 w-6" fill={star <= (userRating || 0) ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CommentSection comments={currentPrompt.comments || []} promptId={currentPrompt.id} />
    </div>
  );
};

export default PromptDetailPage;