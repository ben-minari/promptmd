import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';
import PromptCard from '../components/prompts/PromptCard';
import { usePrompt } from '../context/PromptContext';

const HomePage: React.FC = () => {
  const { featuredPrompts, trendingPrompts } = usePrompt();

  return (
    <div className="space-y-8 pb-10">
      {/* Trending Prompts */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-rose-500 mr-2" />
            <h2 className="text-xl font-semibold text-slate-800">Trending Prompts</h2>
          </div>
          <Link to="/browse" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* Featured Prompts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-slate-800">Featured Prompts</h2>
          </div>
          <Link to="/browse" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6 md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Healthcare AI Prompts that Work
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Discover, share, and utilize AI prompts specifically designed for clinical workflows.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center bg-white text-teal-600 hover:bg-teal-50 px-5 py-2.5 rounded-lg font-medium transition duration-150"
          >
            Browse Prompts
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;