import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Star, Copy, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Tool } from '../types';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTool, saveTool, rateTool } = usePrompt();
  const { user } = useAuth();
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTool = async () => {
      if (!id) {
        setError('Tool ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const toolData = await getTool(id);
        if (toolData) {
          setTool(toolData);
        } else {
          setError('Tool not found');
        }
      } catch (err) {
        setError('Failed to load tool');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTool();
  }, [id, getTool]);
  
  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save tools');
      return;
    }
    
    if (!tool?.id) return;
    
    try {
      await saveTool(tool.id);
      toast.success('Tool saved successfully');
    } catch (err) {
      toast.error('Failed to save tool');
      console.error(err);
    }
  };
  
  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error('Please sign in to rate tools');
      return;
    }
    
    if (!tool?.id) return;
    
    try {
      await rateTool(tool.id, rating);
      toast.success('Rating submitted successfully');
    } catch (err) {
      toast.error('Failed to submit rating');
      console.error(err);
    }
  };
  
  const handleCopy = () => {
    if (!tool) return;
    
    navigator.clipboard.writeText(tool.content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'));
  };
  
  const handleShare = () => {
    if (!tool) return;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (error || !tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Tool not found'}</p>
        <button
          onClick={() => navigate('/browse')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Browse
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/browse')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Browse
      </button>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{tool.title}</h1>
        <p className="text-gray-600 mb-6">{tool.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.specialty.map((tag, index) => (
            <span key={`specialty-${index}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
          {tool.tags.useCase.map((tag, index) => (
            <span key={`useCase-${index}`} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
          {tool.tags.appModel.map((tag, index) => (
            <span key={`appModel-${index}`} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{tool.ratingAvg.toFixed(1)} ({tool.ratingCount})</span>
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
        
        <div className="bg-gray-50 rounded p-4">
          <pre className="whitespace-pre-wrap">{tool.content}</pre>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;