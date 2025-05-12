import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePrompt } from '../context/PromptContext';
import ProfilePage from './ProfilePage';
import SubmitPromptModal from '../components/prompts/SubmitPromptModal';

const ProfilePageWithModal: React.FC = () => {
  const { user } = useAuth();
  const { getUserPrompts, getSavedPrompts } = usePrompt();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userPrompts, setUserPrompts] = useState<any[]>([]);

  useEffect(() => {
    const loadPrompts = async () => {
      if (user) {
        try {
          const prompts = await getUserPrompts();
          setUserPrompts(prompts);
        } catch (error) {
          console.error('Error loading prompts:', error);
        }
      }
    };

    loadPrompts();
  }, [user, getUserPrompts]);

  return (
    <>
      <ProfilePage 
        onOpenModal={() => setIsSubmitModalOpen(true)}
        hasPrompts={user ? userPrompts.length > 0 : false}
      />
      <SubmitPromptModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />
    </>
  );
};

export default ProfilePageWithModal;
