import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TagFilters from '../components/TagFilters';
import { TagCategory, Tag } from '../constants/tags';
import { Tool } from '../types';

const CreatePromptPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTool } = usePrompt();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Record<TagCategory, Tag[]>>({
    specialty: [],
    useCase: [],
    userType: [],
    appModel: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to create a tool');
      return;
    }

    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const newTool: Tool = {
        title,
        description,
        content,
        tags: selectedTags,
        type: 'prompt',
        status: 'published',
        version: '1.0.0',
        saveCount: 0,
        ratingAvg: 0,
        ratingCount: 0
      };

      await addTool(newTool);
      toast.success('Tool created successfully');
      navigate('/browse');
    } catch (error) {
      console.error('Error creating tool:', error);
      toast.error('Failed to create tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center text-slate-600 hover:text-teal-600 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Browse
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Tool</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Provide a brief description of the tool"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                placeholder="Enter the tool content"
                rows={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <TagFilters
                onTagsChange={setSelectedTags}
                className="bg-slate-50 p-4 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-4 py-2 bg-teal-600 text-white rounded-lg
                  hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                `}
              >
                {isSubmitting ? 'Creating...' : 'Create Tool'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePromptPage;