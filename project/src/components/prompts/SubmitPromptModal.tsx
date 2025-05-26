import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Select from 'react-select';
import { usePrompt } from '../../context/PromptContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Tool } from '../../types';

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({ isOpen, onClose }) => {
  const { addTool } = usePrompt();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<{ value: string; label: string }[]>([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState<{ value: string; label: string }[]>([]);
  const [selectedAppModels, setSelectedAppModels] = useState<{ value: string; label: string }[]>([]);
  const [sources, setSources] = useState<string>('');
  
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

  const useCases = [
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
  ].map(useCase => ({ value: useCase, label: useCase }));

  const userTypes = [
    'Physician',
    'Nurse',
    'Medical Student',
    'Resident',
    'Fellow',
    'Pharmacist',
    'Social Worker',
    'Case Manager',
    'Administrator'
  ].map(type => ({ value: type, label: type }));

  const availableAppModels = [
    'GPT-4',
    'Claude',
    'Gemini',
    'LLaMA',
    'Med-PaLM',
    'Perplexity',
    'Doximity GPT',
    'OpenEvidence'
  ].map(model => ({ value: model, label: model }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to submit a tool');
      return;
    }
    
    if (!title || !content) {
      toast.error('Please fill in the required fields (Title and Content)');
      return;
    }
    
    const newTool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'saveCount' | 'ratingAvg' | 'ratingCount'> = {
      title,
      description,
      content,
      type: 'prompt',
      status: 'published',
      tags: {
        specialty: selectedSpecialties.map(s => s.value),
        useCase: selectedUseCases.map(u => u.value),
        userType: selectedUserTypes.map(u => u.value),
        appModel: selectedAppModels.map(m => m.value)
      },
      version: 1,
      authorId: user.uid,
    };
    
    try {
      addTool(newTool);
      toast.success('Tool created successfully!');
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Error creating tool');
      console.error(error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setSelectedSpecialties([]);
    setSelectedUseCases([]);
    setSelectedUserTypes([]);
    setSelectedAppModels([]);
    setSources('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Submit New Tool</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Briefly describe what this tool does"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
              Content*
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
              placeholder="Enter the tool's content or prompt"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Use Cases
            </label>
            <Select
              isMulti
              name="useCases"
              options={useCases}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedUseCases}
              onChange={(selected) => setSelectedUseCases(selected as { value: string; label: string }[])}
              placeholder="Select use cases..."
              isSearchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              User Types
            </label>
            <Select
              isMulti
              name="userTypes"
              options={userTypes}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedUserTypes}
              onChange={(selected) => setSelectedUserTypes(selected as { value: string; label: string }[])}
              placeholder="Select user types..."
              isSearchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Compatible App Models
            </label>
            <Select
              isMulti
              name="appModels"
              options={availableAppModels}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedAppModels}
              onChange={(selected) => setSelectedAppModels(selected as { value: string; label: string }[])}
              placeholder="Select compatible app models..."
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
              Add one source per line. These will be displayed with the tool.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <Save size={20} className="inline-block mr-2" />
              Submit Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPromptModal;