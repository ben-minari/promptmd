import React, { useState, useEffect } from 'react';
import { usePrompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';

const PromptTest: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const {
    allPrompts,
    featuredPrompts,
    trendingPrompts,
    getUserPrompts,
    getSavedPrompts,
    addPrompt,
    savePrompt,
    ratePrompt,
    loading,
    error,
  } = usePrompt();

  const [userPrompts, setUserPrompts] = useState<any[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    content: '',
    category: 'General',
    specialty: 'General',
    tools: ['ChatGPT'],
  });

  useEffect(() => {
    const loadUserPrompts = async () => {
      if (user) {
        const prompts = await getUserPrompts();
        setUserPrompts(prompts);
        setSavedPrompts(getSavedPrompts());
      }
    };
    loadUserPrompts();
  }, [user, getUserPrompts, getSavedPrompts]);

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPrompt(newPrompt);
      setNewPrompt({
        title: '',
        description: '',
        content: '',
        category: 'General',
        specialty: 'General',
        tools: ['ChatGPT'],
      });
      const prompts = await getUserPrompts();
      setUserPrompts(prompts);
    } catch (err) {
      console.error('Error adding prompt:', err);
    }
  };

  const handleSavePrompt = async (promptId: string) => {
    try {
      await savePrompt(promptId);
      setSavedPrompts(getSavedPrompts());
    } catch (err) {
      console.error('Error saving prompt:', err);
    }
  };

  const handleRatePrompt = async (promptId: string, rating: number) => {
    try {
      await ratePrompt(promptId, rating);
    } catch (err) {
      console.error('Error rating prompt:', err);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Please sign in to test prompts</h2>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Prompt Management Test</h2>

      {/* Add New Prompt Form */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-4">Add New Prompt</h3>
        <form onSubmit={handleAddPrompt} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <input
              type="text"
              value={newPrompt.description}
              onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={newPrompt.content}
              onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Prompt
          </button>
        </form>
      </div>

      {/* Featured Prompts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Featured Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPrompts.map((prompt) => (
            <div key={prompt.id} className="border p-4 rounded">
              <h4 className="font-bold">{prompt.title}</h4>
              <p className="text-sm text-gray-600">{prompt.description}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleSavePrompt(prompt.id)}
                  className="text-blue-500 mr-2"
                >
                  {savedPrompts.some((p) => p.id === prompt.id) ? 'Unsave' : 'Save'}
                </button>
                <button
                  onClick={() => handleRatePrompt(prompt.id, 5)}
                  className="text-yellow-500"
                >
                  Rate (5)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User's Prompts */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPrompts.map((prompt) => (
            <div key={prompt.id} className="border p-4 rounded">
              <h4 className="font-bold">{prompt.title}</h4>
              <p className="text-sm text-gray-600">{prompt.description}</p>
              <p className="mt-2 text-sm">
                Rating: {prompt.rating} ({prompt.ratingCount} votes)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Prompts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Saved Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPrompts.map((prompt) => (
            <div key={prompt.id} className="border p-4 rounded">
              <h4 className="font-bold">{prompt.title}</h4>
              <p className="text-sm text-gray-600">{prompt.description}</p>
              <button
                onClick={() => handleSavePrompt(prompt.id)}
                className="text-red-500 mt-2"
              >
                Unsave
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptTest; 