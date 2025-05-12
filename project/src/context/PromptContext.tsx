import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './AuthContext';

// Sample data
import { samplePrompts } from '../data/samplePrompts';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  specialty: string;
  tools: string[];
  sources?: string[]; // Optional array of sources
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  rating: number;
  rating_count: number;
  usage_count: number;
  featured: boolean;
  comments?: any[]; // Optional array of comments
}

interface PromptContextType {
  allPrompts: Prompt[];
  featuredPrompts: Prompt[];
  trendingPrompts: Prompt[];
  getPromptById: (id: string) => Prompt | undefined;
  getUserPromptRating: (promptId: string) => Promise<number | null>;
  getUserPrompts: () => Promise<Prompt[]>;
  getSavedPrompts: () => Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'author' | 'created_at' | 'rating' | 'rating_count' | 'usage_count' | 'featured'>) => Promise<void>;
  savePrompt: (promptId: string) => Promise<void>;
  ratePrompt: (promptId: string, rating: number) => Promise<Prompt>;
  refreshPrompts: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [savedPromptIds, setSavedPromptIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
    fetchSavedPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      console.log('Fetching prompts from Supabase...');
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }
      
      console.log('Fetched prompts:', data);
      setPrompts(data || []);
    } catch (err) {
      console.error('Error in fetchPrompts:', err);
      setError('Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPrompts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('saved_prompts')
        .select('prompt_id')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setSavedPromptIds(data?.map(item => item.prompt_id) || []);
    } catch (err) {
      console.error('Error fetching saved prompts:', err);
    }
  };

  const getPromptById = (id: string) => {
    return prompts.find(prompt => prompt.id === id);
  };

  const featuredPrompts = prompts.filter(prompt => prompt.featured).slice(0, 3);

  const trendingPrompts = [...prompts]
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 3);

  const getUserPrompts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return prompts.filter(prompt => prompt.author.id === session?.user?.id);
  };

  const getSavedPrompts = () => {
    return prompts.filter(prompt => savedPromptIds.includes(prompt.id));
  };

  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'author' | 'created_at' | 'rating' | 'rating_count' | 'usage_count' | 'featured'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('User not authenticated');

      console.log('Creating prompt with data:', promptData);
      console.log('User session:', session.user);

      const newPrompt = {
        ...promptData,
        tools: promptData.tools,
        author: {
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'Anonymous',
          avatar: session.user.user_metadata.avatar_url || '',
        },
        created_at: new Date().toISOString(),
        rating: 0,
        rating_count: 0,
        usage_count: 0,
        featured: false,
      };

      console.log('Sending to Supabase:', newPrompt);

      const { data, error } = await supabase
        .from('prompts')
        .insert([newPrompt])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Created prompt:', data);
      
      // Verify the prompt was created by fetching it
      const { data: verifyData, error: verifyError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', data.id)
        .single();

      if (verifyError) {
        console.error('Error verifying prompt creation:', verifyError);
      } else {
        console.log('Verified prompt in database:', verifyData);
      }

      setPrompts([data, ...prompts]);
    } catch (err) {
      console.error('Error in addPrompt:', err);
      setError('Failed to add prompt');
      throw err;
    }
  };

  const savePrompt = async (promptId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('User not authenticated');

      if (savedPromptIds.includes(promptId)) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_prompts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('prompt_id', promptId);

        if (error) throw error;
        setSavedPromptIds(savedPromptIds.filter(id => id !== promptId));
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_prompts')
          .insert([{ user_id: session.user.id, prompt_id: promptId }]);

        if (error) throw error;
        setSavedPromptIds([...savedPromptIds, promptId]);
      }
    } catch (err) {
      setError('Failed to save prompt');
      throw err;
    }
  };

  const ratePrompt = async (promptId: string, rating: number): Promise<Prompt> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('User not authenticated');

      console.log('Rating prompt:', { promptId, rating, userId: session.user.id });

      // First, check if the user has already rated this prompt
      const { data: existingRating, error: checkError } = await supabase
        .from('prompt_ratings')
        .select('id, rating')
        .eq('user_id', session.user.id)
        .eq('prompt_id', promptId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing rating:', checkError);
        throw checkError;
      }

      console.log('Existing rating:', existingRating);

      let error;
      if (existingRating) {
        // Update existing rating
        console.log('Updating existing rating:', { id: existingRating.id, newRating: rating });
        const { error: updateError } = await supabase
          .from('prompt_ratings')
          .update({ rating, updated_at: new Date().toISOString() })
          .eq('id', existingRating.id);
        error = updateError;
      } else {
        // Insert new rating
        console.log('Inserting new rating:', { userId: session.user.id, promptId, rating });
        const { error: insertError } = await supabase
          .from('prompt_ratings')
          .insert({
            user_id: session.user.id,
            prompt_id: promptId,
            rating
          });
        error = insertError;
      }

      if (error) {
        console.error('Error updating/inserting rating:', error);
        throw error;
      }

      // Wait a short moment to ensure the trigger has completed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Refresh all prompts to ensure we have the latest data
      await refreshPrompts();

      // Fetch the specific prompt to return
      const { data: updatedPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single();

      if (fetchError) {
        console.error('Error fetching updated prompt:', fetchError);
        throw fetchError;
      }
      if (!updatedPrompt) {
        throw new Error('Failed to fetch updated prompt');
      }

      console.log('Updated prompt from database:', updatedPrompt);

      // Also fetch the current ratings to verify
      const { data: ratings, error: ratingsError } = await supabase
        .from('prompt_ratings')
        .select('rating')
        .eq('prompt_id', promptId);

      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
      } else {
        console.log('Current ratings for prompt:', ratings);
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        console.log('Calculated average rating:', avgRating);
        console.log('Number of ratings:', ratings.length);
      }

      return updatedPrompt as Prompt;
    } catch (err) {
      console.error('Error in ratePrompt:', err);
      setError('Failed to rate prompt');
      throw err;
    }
  };

  const getUserPromptRating = async (promptId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from('prompt_ratings')
        .select('rating')
        .eq('user_id', session.user.id)
        .eq('prompt_id', promptId)
        .maybeSingle();

      if (error) {
        console.error('Error getting user rating:', error);
        return null;
      }
      return data?.rating || null;
    } catch (err) {
      console.error('Error getting user rating:', err);
      return null;
    }
  };

  const refreshPrompts = async () => {
    try {
      console.log('Refreshing prompts...');
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error refreshing prompts:', error);
        throw error;
      }
      
      console.log('Refreshed prompts:', data);
      setPrompts(data || []);
    } catch (err) {
      console.error('Error in refreshPrompts:', err);
      setError('Failed to refresh prompts');
    }
  };

  return (
    <PromptContext.Provider
      value={{
        allPrompts: prompts,
        featuredPrompts,
        trendingPrompts,
        getPromptById,
        getUserPromptRating,
        getUserPrompts,
        getSavedPrompts,
        addPrompt,
        savePrompt,
        ratePrompt,
        refreshPrompts,
        loading,
        error,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};