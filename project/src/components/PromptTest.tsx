import React, { useState, useEffect } from 'react';
import { usePrompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import { Tool } from '../types';

const PromptTest: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const {
    tools,
    userTools,
    savedTools,
    addTool,
    saveTool,
    rateTool,
    getTools
  } = usePrompt();

  const [newTool, setNewTool] = useState<Partial<Tool>>({
    title: '',
    description: '',
    content: '',
    tags: {
      specialty: ['General'],
      useCase: ['General'],
      userType: ['General'],
      appModel: ['ChatGPT']
    },
    type: 'prompt',
    status: 'published',
    version: '1.0.0',
    saveCount: 0,
    ratingAvg: 0,
    ratingCount: 0
  });

  useEffect(() => {
    if (user) {
      getTools();
    }
  }, [user, getTools]);

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTool(newTool as Tool);
      setNewTool({
        title: '',
        description: '',
        content: '',
        tags: {
          specialty: ['General'],
          useCase: ['General'],
          userType: ['General'],
          appModel: ['ChatGPT']
        },
        type: 'prompt',
        status: 'published',
        version: '1.0.0',
        saveCount: 0,
        ratingAvg: 0,
        ratingCount: 0
      });
    } catch (err) {
      console.error('Error adding tool:', err);
    }
  };

  const handleSaveTool = async (toolId: string) => {
    try {
      await saveTool(toolId);
    } catch (err) {
      console.error('Error saving tool:', err);
    }
  };

  const handleRateTool = async (toolId: string, rating: number) => {
    try {
      await rateTool(toolId, rating);
    } catch (err) {
      console.error('Error rating tool:', err);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prompt Test</h1>
      
      {/* Add New Tool Form */}
      <form onSubmit={handleAddTool} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Tool</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newTool.title}
            onChange={(e) => setNewTool({ ...newTool, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTool.description}
            onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={newTool.content}
            onChange={(e) => setNewTool({ ...newTool, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Tool
          </button>
        </div>
      </form>

      {/* User's Tools */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Tools</h2>
        {userTools.map((tool) => (
          <div key={tool.id} className="p-4 border rounded mb-4">
            <h3 className="font-semibold">{tool.title}</h3>
            <p>{tool.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleSaveTool(tool.id!)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {savedTools.some((t) => t.id === tool.id) ? 'Unsave' : 'Save'}
              </button>
              <button
                onClick={() => handleRateTool(tool.id!, 5)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Rate 5 Stars
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* All Tools */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Tools</h2>
        {tools.map((tool) => (
          <div key={tool.id} className="p-4 border rounded mb-4">
            <h3 className="font-semibold">{tool.title}</h3>
            <p>{tool.description}</p>
            <p className="text-sm text-gray-500">
              Saved {tool.saveCount} times | Rated {tool.ratingAvg.toFixed(1)} ({tool.ratingCount} ratings)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptTest; 