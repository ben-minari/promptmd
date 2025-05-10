import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Development user credentials
const DEV_USER = {
  email: 'dev@promptmd.local',
  password: 'devpassword123',
  name: 'Development User'
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithDoximity: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Setup development user if in development mode
  useEffect(() => {
    const setupDevUser = async () => {
      if (import.meta.env.DEV) {
        try {
          // Try to sign in with dev credentials
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: DEV_USER.email,
            password: DEV_USER.password,
          });

          // If sign in fails, create the dev user
          if (signInError) {
            const { error: signUpError } = await supabase.auth.signUp({
              email: DEV_USER.email,
              password: DEV_USER.password,
              options: {
                data: {
                  full_name: DEV_USER.name,
                },
              },
            });

            if (signUpError) {
              console.error('Error creating dev user:', signUpError);
            } else {
              // Sign in after creating the user
              await supabase.auth.signInWithPassword({
                email: DEV_USER.email,
                password: DEV_USER.password,
              });
            }
          }
        } catch (error) {
          console.error('Error setting up dev user:', error);
        }
      }
    };

    setupDevUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      console.log('Sign out successful');
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const loginWithDoximity = async () => {
    // Mock implementation for now
    console.log('Doximity login not implemented yet');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle,
      signOut,
      login, 
      register,
      loginWithDoximity 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};