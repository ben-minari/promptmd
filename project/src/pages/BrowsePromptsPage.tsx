import React, { useState } from 'react';
import { useTools } from '../hooks/useTools';
import PromptCard from '../components/prompts/PromptCard';
import TagFilters from '../components/TagFilters';
import { TagCategory, Tag } from '../constants/tags';
import { useSearch } from '../context/SearchContext';

const BrowsePromptsPage: React.FC = () => {
  const { tools, loading, error } = useTools();
  const { searchQuery } = useSearch();
  const [selectedTags, setSelectedTags] = useState<Record<TagCategory, Tag[]>>({
    specialty: [],
    useCase: [],
    userType: [],
    appModel: [],
  });
  const [showFilters, setShowFilters] = useState(true); // Always show sidebar

  // Filter tools based on search query and selected tags
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = Object.entries(selectedTags).every(([category, selectedTags]) => {
      if (selectedTags.length === 0) return true;
      return selectedTags.some(tag => tool.tags[category as TagCategory].includes(tag));
    });

    return matchesSearch && matchesTags;
  });

  const handleTagChange = (newTags: Record<TagCategory, Tag[]>) => {
    setSelectedTags(newTags);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-slate-900 mb-4">Filters</h2>
              <TagFilters onTagsChange={handleTagChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading prompts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading prompts. Please try again.</p>
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No prompts found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map(tool => (
                  <PromptCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowsePromptsPage;