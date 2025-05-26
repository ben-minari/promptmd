import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { getRedirectResult } from 'firebase/auth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the redirect result
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          // User is authenticated, redirect to home
          navigate('/');
        } else {
          // No user found, redirect to auth page with error
          navigate('/auth?error=no-session');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/auth?error=auth-failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 