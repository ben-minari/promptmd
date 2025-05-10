import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import Select from 'react-select';
import PromptCard from '../components/prompts/PromptCard';
import { usePrompt } from '../context/PromptContext';

const BrowsePromptsPage: React.FC = () => {
  const { allPrompts } = usePrompt();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Get search parameters
  const searchQuery = searchParams.get('q') || '';
  const categoryFilters = searchParams.getAll('category');
  const specialtyFilters = searchParams.getAll('specialty');
  const toolFilters = searchParams.getAll('tool');
  const sortBy = searchParams.get('sort') || 'popular';

  // State for filter controls
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>(
    categoryFilters.map(cat => ({ value: cat, label: cat }))
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>(
    specialtyFilters.map(spec => ({ value: spec, label: spec }))
  );
  const [selectedTools, setSelectedTools] = useState<{ value: string; label: string }[]>(
    toolFilters.map(tool => ({ value: tool, label: tool }))
  );
  const [selectedSort, setSelectedSort] = useState(sortBy);

  // Available filter options
  const categories = [
    'Patient Education',
    'Clinical Documentation',
    'Decision Support',
    'Workflow Automation',
    'Triage',
    'Medication Management',
    'Discharge Planning',
    'Quality & Safety Monitoring',
    'Population Health Analytics',
    'Care Coordination',
    'Billing & Coding Assistance'
  ].map(cat => ({ value: cat, label: cat }));

  const specialties = [
    'Allergy & Immunology',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Gastroenterology',
    'Geriatrics',
    'Hematology/Oncology',
    'Hospitalist Medicine',
    'Infectious Diseases',
    'Internal Medicine',
    'Nephrology',
    'Neurology',
    'OB/GYN',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology (ENT)',
    'Pediatrics',
    'Physical Medicine & Rehab',
    'Psychiatry',
    'Pulmonology/Critical Care',
    'Radiology',
    'Rheumatology',
    'Surgery'
  ].map(spec => ({ value: spec, label: spec }));

  const tools = [
    'GPT-4',
    'Claude',
    'Gemini',
    'LLaMA',
    'Med-PaLM',
    'Perplexity',
    'Doximity GPT',
    'OpenEvidence'
  ].map(tool => ({ value: tool, label: tool }));

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchInput) params.set('q', searchInput);
    selectedCategories.forEach(cat => params.append('category', cat.value));
    selectedSpecialties.forEach(spec => params.append('specialty', spec.value));
    selectedTools.forEach(tool => params.append('tool', tool.value));
    params.set('sort', selectedSort);
    
    setSearchParams(params);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  // Update URL when filters change
  useEffect(() => {
    updateFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedSpecialties, selectedTools, selectedSort]);

  // Filter prompts based on search parameters
  const filteredPrompts = allPrompts.filter(prompt => {
    const matchesSearch = !searchQuery || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(prompt.category);
    const matchesSpecialty = specialtyFilters.length === 0 || specialtyFilters.includes(prompt.specialty);
    const matchesTool = toolFilters.length === 0 || toolFilters.some(tool => prompt.tools.includes(tool));
    
    return matchesSearch && matchesCategory && matchesSpecialty && matchesTool;
  });

  // Sort prompts
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.usage_count - a.usage_count;
    }
  });

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategories([]);
    setSelectedSpecialties([]);
    setSelectedTools([]);
    setSelectedSort('popular');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || categoryFilters.length > 0 || specialtyFilters.length > 0 || toolFilters.length > 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Browse Prompts</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar - desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 sticky top-24">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
              <Select
                isMulti
                name="categories"
                options={categories}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedCategories}
                onChange={(selected) => setSelectedCategories(selected as { value: string; label: string }[])}
                placeholder="Select categories..."
                isSearchable
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Specialties</h3>
              <Select
                isMulti
                name="specialties"
                options={specialties}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedSpecialties}
                onChange={(selected) => setSelectedSpecialties(selected as { value: string; label: string }[])}
                placeholder="Select specialties..."
                isSearchable
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Compatible Tools</h3>
              <Select
                isMulti
                name="tools"
                options={tools}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedTools}
                onChange={(selected) => setSelectedTools(selected as { value: string; label: string }[])}
                placeholder="Select compatible tools..."
                isSearchable
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition duration-150"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile filters - slide in panel */}
        {showFilters && (
          <div className="fixed inset-0 bg-slate-800 bg-opacity-75 z-50 md:hidden">
            <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">Filters</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto h-full pb-24">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Sort By</h3>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
                  <Select
                    isMulti
                    name="categories"
                    options={categories}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedCategories}
                    onChange={(selected) => setSelectedCategories(selected as { value: string; label: string }[])}
                    placeholder="Select categories..."
                    isSearchable
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Specialties</h3>
                  <Select
                    isMulti
                    name="specialties"
                    options={specialties}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedSpecialties}
                    onChange={(selected) => setSelectedSpecialties(selected as { value: string; label: string }[])}
                    placeholder="Select specialties..."
                    isSearchable
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Compatible Tools</h3>
                  <Select
                    isMulti
                    name="tools"
                    options={tools}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedTools}
                    onChange={(selected) => setSelectedTools(selected as { value: string; label: string }[])}
                    placeholder="Select compatible tools..."
                    isSearchable
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      updateFilters();
                      setShowFilters(false);
                    }}
                    className="flex-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition duration-150"
                  >
                    Apply Filters
                  </button>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition duration-150"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile search bar */}
          <div className="block md:hidden mb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-2">
              <span className="text-sm text-slate-500">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  Search: {searchQuery}
                  <button
                    onClick={() => {
                      setSearchInput('');
                      searchParams.delete('q');
                      setSearchParams(searchParams);
                    }}
                    className="ml-1 text-slate-400 hover:text-slate-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {categoryFilters.map(category => (
                <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  Category: {category}
                  <button
                    onClick={() => {
                      setSelectedCategories(selectedCategories.filter(cat => cat.value !== category));
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category', category);
                      setSearchParams(newParams);
                    }}
                    className="ml-1 text-teal-500 hover:text-teal-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {specialtyFilters.map(specialty => (
                <span key={specialty} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Specialty: {specialty}
                  <button
                    onClick={() => {
                      setSelectedSpecialties(selectedSpecialties.filter(spec => spec.value !== specialty));
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('specialty', specialty);
                      setSearchParams(newParams);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {toolFilters.map(tool => (
                <span key={tool} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Tool: {tool}
                  <button
                    onClick={() => {
                      setSelectedTools(selectedTools.filter(t => t.value !== tool));
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('tool', tool);
                      setSearchParams(newParams);
                    }}
                    className="ml-1 text-purple-500 hover:text-purple-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              <button
                onClick={clearFilters}
                className="text-xs text-slate-500 hover:text-teal-600 font-medium ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium">{sortedPrompts.length}</span> results
              </p>
              
              {/* Desktop sort dropdown */}
              <div className="hidden md:block relative">
                <select
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-1 pl-3 pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="popular">Sort: Most Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="rating">Sort: Highest Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {sortedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedPrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-100">
                <p className="text-lg text-slate-600 mb-4">No prompts found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition duration-150"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePromptsPage;