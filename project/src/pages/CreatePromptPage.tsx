import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, HelpCircle } from 'lucide-react';
import Select from 'react-select';
import { usePrompt } from '../context/PromptContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

type PromptTemplate = {
  title: string;
  description: string;
  content: string;
  category: string;
};

const CreatePromptPage: React.FC = () => {
  const { addPrompt } = usePrompt();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>([]);
  const [selectedTools, setSelectedTools] = useState<{ value: string; label: string }[]>([]);
  const [showTips, setShowTips] = useState(false);
  
  // Available options for dropdowns
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
  
  // Template examples
  const templates: PromptTemplate[] = [
    {
      title: 'Clinical Note Template',
      description: 'Template for creating structured clinical notes with patient history, examination, assessment and plan.',
      content: 'Create a detailed clinical note for a patient with [CONDITION]. Include the following sections:\n\n1. Chief Complaint\n2. History of Present Illness\n3. Past Medical History\n4. Review of Systems\n5. Physical Examination\n6. Assessment\n7. Plan\n\nPatient details: [PATIENT_DETAILS]',
      category: 'Clinical Documentation'
    },
    {
      title: 'Differential Diagnosis Generator',
      description: 'Generate comprehensive differential diagnoses based on patient symptoms and characteristics.',
      content: 'Given the following patient presentation, provide a prioritized differential diagnosis with brief explanations for each:\n\nPatient Demographics: [AGE, SEX, RELEVANT HISTORY]\nPresenting Symptoms: [SYMPTOMS]\nDuration: [DURATION]\nRelevant Vital Signs: [VITALS IF AVAILABLE]\nRelevant Test Results: [TEST RESULTS IF AVAILABLE]\n\nFor each potential diagnosis, include:\n1. Name of condition\n2. Key supporting features from the presentation\n3. Suggested next steps for confirmation\n4. Brief explanation of pathophysiology',
      category: 'Decision Support'
    },
    {
      title: 'Patient Education Explainer',
      description: 'Explain complex medical concepts or conditions in patient-friendly language.',
      content: 'Explain [MEDICAL_CONDITION/PROCEDURE] to a patient with a [EDUCATION_LEVEL] education level. Include:\n\n1. Simple explanation of the condition/procedure using analogies\n2. Typical symptoms and progression\n3. Standard treatment approaches\n4. Important warning signs to watch for\n5. Lifestyle modifications that may help\n\nAvoid medical jargon and use plain language. The patient is [AGE] years old and has [RELEVANT_CONTEXT].',
      category: 'Patient Education'
    }
  ];
  
  const applyTemplate = (template: PromptTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setContent(template.content);
    setSelectedCategories([{ value: template.category, label: template.category }]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to create a prompt');
      navigate('/auth');
      return;
    }
    
    if (!title || !description || !content || selectedCategories.length === 0 || selectedSpecialties.length === 0 || selectedTools.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newPrompt = {
      title,
      description,
      content,
      category: selectedCategories[0].value, // Using first selected category as primary
      specialty: selectedSpecialties[0].value, // Using first selected specialty as primary
      tools: selectedTools.map(tool => tool.value),
    };
    
    try {
      addPrompt(newPrompt);
      toast.success('Prompt created successfully!');
      navigate('/browse');
    } catch (error) {
      toast.error('Error creating prompt');
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create a New Prompt</h1>
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center text-sm text-teal-600 hover:text-teal-700"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          {showTips ? 'Hide Tips' : 'Show Tips'}
        </button>
      </div>
      
      {showTips && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium text-teal-800 mb-2">Tips for Creating Effective Prompts</h2>
          <ul className="list-disc pl-5 text-sm text-teal-700 space-y-1">
            <li>Be specific about the task you want the AI to perform</li>
            <li>Include placeholders for variable information (e.g., [PATIENT_AGE])</li>
            <li>Structure your prompt with clear sections</li>
            <li>Specify the desired format for the AI's response</li>
            <li>Add context that helps the AI understand the clinical scenario</li>
            <li>Test your prompt with different variations to ensure consistent results</li>
          </ul>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Start from a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <div 
                key={index}
                className="border border-slate-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-sm cursor-pointer transition duration-150"
                onClick={() => applyTemplate(template)}
              >
                <h3 className="font-medium text-slate-800 mb-2">{template.title}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                  {template.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Prompt Title*
            </label>
            <input
              type="text"
              id="title"
              placeholder="E.g., SOAP Note Template for Primary Care"
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              placeholder="Briefly describe what this prompt is used for and its benefits"
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Categories*
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
                Specialties*
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
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Compatible Tools*
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
            {selectedTools.length === 0 && (
              <p className="mt-1 text-xs text-red-500">Please select at least one compatible tool</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
              Prompt Content*
            </label>
            <textarea
              id="content"
              placeholder="Enter your prompt content here. Use [PLACEHOLDERS] for variable information."
              rows={12}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Use placeholders like [PATIENT_AGE] or [CONDITION] for variable information.
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition duration-150"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Prompt
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePromptPage;