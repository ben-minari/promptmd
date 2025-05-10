import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
        
        if (error) {
          console.error('Error getting session from URL:', error);
          navigate('/auth?error=auth-failed');
          return;
        }
        
        if (session?.user) {
          // User is authenticated, redirect to home
          navigate('/');
        } else {
          // No session found, redirect to auth page with error
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