import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Select from 'react-select';
import { usePrompt } from '../../context/PromptContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({ isOpen, onClose }) => {
  const { addPrompt } = usePrompt();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>([]);
  const [selectedTools, setSelectedTools] = useState<{ value: string; label: string }[]>([]);
  const [sources, setSources] = useState<string>('');
  
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

  const availableTools = [
    'GPT-4',
    'Claude',
    'Gemini',
    'LLaMA',
    'Med-PaLM',
    'Perplexity',
    'Doximity GPT',
    'OpenEvidence'
  ].map(tool => ({ value: tool, label: tool }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to submit a prompt');
      return;
    }
    
    if (!title || !content) {
      toast.error('Please fill in the required fields (Title and Prompt Content)');
      return;
    }
    
    const newPrompt = {
      title,
      description,
      content,
      category: selectedCategories[0]?.value || 'General',
      specialty: selectedSpecialties[0]?.value || 'General',
      tools: selectedTools.map(tool => tool.value),
      sources: sources ? sources.split('\n').filter(source => source.trim()) : undefined,
    };
    
    try {
      addPrompt(newPrompt);
      toast.success('Prompt created successfully!');
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Error creating prompt');
      console.error(error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setSelectedCategories([]);
    setSelectedSpecialties([]);
    setSelectedTools([]);
    setSources('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Create a Prompt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition duration-150"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="E.g., SOAP Note Template"
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
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Briefly describe what this prompt is used for"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                Prompt Content*
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
                placeholder="Enter your prompt content here. Use [PLACEHOLDERS] for variable information."
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                Use placeholders like [PATIENT_AGE] for variable information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                  Categories
                </label>
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

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-1">
                  Specialties
                </label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Compatible Tools
              </label>
              <Select
                isMulti
                name="tools"
                options={availableTools}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedTools}
                onChange={(selected) => setSelectedTools(selected as { value: string; label: string }[])}
                placeholder="Select compatible tools..."
                isSearchable
              />
            </div>

            <div>
              <label htmlFor="sources" className="block text-sm font-medium text-slate-700 mb-1">
                Sources (Optional)
              </label>
              <textarea
                id="sources"
                value={sources}
                onChange={(e) => setSources(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="Enter sources (one per line) - e.g., medical journals, URLs, etc."
              />
              <p className="mt-1 text-xs text-slate-500">
                Add one source per line. These will be displayed with the prompt.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPromptModal;