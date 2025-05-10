import React, { useState, useEffect } from 'react';
import { Bookmark, Edit, FileText, Settings, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePrompt } from '../context/PromptContext';
import PromptCard from '../components/prompts/PromptCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { getUserPrompts, getSavedPrompts } = usePrompt();
  const [activeTab, setActiveTab] = useState('my-prompts');
  const [userPrompts, setUserPrompts] = useState<any[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrompts = async () => {
      if (user) {
        try {
          const prompts = await getUserPrompts();
          setUserPrompts(prompts);
          setSavedPrompts(getSavedPrompts());
        } catch (error) {
          console.error('Error loading prompts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPrompts();
  }, [user, getUserPrompts, getSavedPrompts]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">You're not signed in</h1>
        <p className="text-slate-600 mb-6">Please sign in to view your profile</p>
        <a 
          href="/auth" 
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Mock user stats
  const stats = [
    { label: 'Prompts Created', value: userPrompts.length, icon: <FileText className="h-5 w-5 text-purple-500" /> },
    { label: 'Saved Prompts', value: savedPrompts.length, icon: <Bookmark className="h-5 w-5 text-teal-500" /> },
    { label: 'Average Rating', value: '4.8', icon: <Star className="h-5 w-5 text-amber-500" /> },
    { label: 'Prompt Uses', value: '138', icon: <Users className="h-5 w-5 text-blue-500" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* User Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden">
              <img 
                src={user.user_metadata?.avatar_url || "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                alt={user.user_metadata?.full_name || "User"} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-slate-800">{user.user_metadata?.full_name || "Anonymous User"}</h1>
              <p className="text-slate-600">{user.email}</p>
            </div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition duration-150 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {stat.icon}
                  <span className="ml-2 text-sm font-medium text-slate-600">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('my-prompts')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'my-prompts'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              My Prompts
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Saved Prompts
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'my-prompts' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">My Prompts</h2>
                <a
                  href="/create"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Create New
                </a>
              </div>
              
              {userPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPrompts.map(prompt => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                  <p className="text-slate-600 mb-4">You haven't created any prompts yet.</p>
                  <a
                    href="/create"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
                  >
                    Create Your First Prompt
                  </a>
                </div>
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Saved Prompts</h2>
              </div>
              
              {savedPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPrompts.map(prompt => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                  <p className="text-slate-600 mb-4">You haven't saved any prompts yet.</p>
                  <a
                    href="/browse"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
                  >
                    Browse Prompts
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;