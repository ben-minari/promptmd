import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  WithFieldValue,
  onSnapshot,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { Tool } from '../types';

interface PromptContextType {
  tools: Tool[];
  userTools: Tool[];
  savedTools: Tool[];
  featuredPrompts: Tool[];
  trendingPrompts: Tool[];
  getTools: () => Promise<Tool[]>;
  getTool: (id: string) => Promise<Tool | null>;
  getUserPrompts: () => Promise<Tool[]>;
  getSavedPrompts: () => Promise<Tool[]>;
  addTool: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'saveCount' | 'ratingAvg' | 'ratingCount'>) => Promise<void>;
  updateTool: (id: string, tool: Partial<Tool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  saveTool: (id: string) => Promise<void>;
  rateTool: (id: string, rating: number) => Promise<void>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [featuredPrompts, setFeaturedPrompts] = useState<Tool[]>([]);
  const [trendingPrompts, setTrendingPrompts] = useState<Tool[]>([]);

  useEffect(() => {
    if (user) {
      // Set up real-time listener for user's tools
      const userToolsRef = collection(db, 'tools');
      const userToolsQuery = query(
        userToolsRef,
        where('authorId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      
      const userToolsUnsubscribe = onSnapshot(userToolsQuery, (snapshot) => {
        const loadedTools = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Tool[];
        setUserTools(loadedTools);
      });

      // Set up real-time listener for saved tools
      const userRef = doc(db, 'users', user.uid);
      const savedToolsUnsubscribe = onSnapshot(userRef, async (userDoc) => {
        if (userDoc.exists()) {
          const savedToolIds = userDoc.data().savedTools || [];
          const savedToolsData = await Promise.all(
            savedToolIds.map(async (toolId: string) => {
              const toolDoc = await getDoc(doc(db, 'tools', toolId));
              if (toolDoc.exists()) {
                const toolData = toolDoc.data();
                return {
                  ...toolData,
                  id: toolDoc.id,
                  createdAt: toolData.createdAt?.toDate(),
                  updatedAt: toolData.updatedAt?.toDate(),
                  isSaved: true
                } as Tool;
              }
              return null;
            })
          );
          setSavedTools(savedToolsData.filter((tool): tool is Tool => tool !== null));
        }
      });

      return () => {
        userToolsUnsubscribe();
        savedToolsUnsubscribe();
      };
    }
  }, [user]);

  // Load featured and trending prompts
  useEffect(() => {
    const loadFeaturedAndTrending = async () => {
      try {
        // Get featured prompts (highest rated)
        const featuredQuery = query(
          collection(db, 'tools'),
          where('status', '==', 'published'),
          orderBy('ratingAvg', 'desc'),
          orderBy('__name__', 'desc'),
          limit(3)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const featured = featuredSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Tool[];
        setFeaturedPrompts(featured);

        // Get trending prompts (most saved)
        const trendingQuery = query(
          collection(db, 'tools'),
          where('status', '==', 'published'),
          orderBy('saveCount', 'desc'),
          limit(3)
        );
        const trendingSnapshot = await getDocs(trendingQuery);
        const trending = trendingSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Tool[];
        setTrendingPrompts(trending);
      } catch (error) {
        console.error('Error loading featured and trending prompts:', error);
      }
    };

    loadFeaturedAndTrending();
  }, []);

  const getTools = async (): Promise<Tool[]> => {
    try {
      const toolsRef = collection(db, 'tools');
      const q = query(
        toolsRef,
        where('status', '==', 'published'),
        orderBy('updatedAt', 'desc'),
        orderBy('__name__', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const loadedTools = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Tool[];
      setTools(loadedTools);
      return loadedTools;
    } catch (error) {
      console.error('Error getting tools:', error);
      return [];
    }
  };

  const getTool = async (id: string): Promise<Tool | null> => {
    try {
      const toolDoc = await getDoc(doc(db, 'tools', id));
      if (toolDoc.exists()) {
        const toolData = toolDoc.data();
        return {
          ...toolData,
          id: toolDoc.id,
          createdAt: toolData.createdAt?.toDate(),
          updatedAt: toolData.updatedAt?.toDate()
        } as Tool;
      }
      return null;
    } catch (error) {
      console.error('Error getting tool:', error);
      return null;
    }
  };

  const getUserPrompts = async (): Promise<Tool[]> => {
    if (!user) throw new Error('User must be authenticated to get user prompts');

    try {
      const toolsRef = collection(db, 'tools');
      const q = query(
        toolsRef,
        where('authorId', '==', user.uid),
        orderBy('updatedAt', 'desc'),
        orderBy('__name__', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const loadedTools = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Tool[];
      setUserTools(loadedTools);
      return loadedTools;
    } catch (error) {
      console.error('Error getting user prompts:', error);
      return [];
    }
  };

  const getSavedPrompts = async (): Promise<Tool[]> => {
    if (!user) throw new Error('User must be authenticated to get saved prompts');

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return [];
      }

      const savedToolIds = userDoc.data().savedTools || [];
      const savedToolsData = await Promise.all(
        savedToolIds.map(async (toolId: string) => {
          const toolDoc = await getDoc(doc(db, 'tools', toolId));
          if (toolDoc.exists()) {
            const toolData = toolDoc.data();
            return {
              ...toolData,
              id: toolDoc.id,
              createdAt: toolData.createdAt?.toDate(),
              updatedAt: toolData.updatedAt?.toDate(),
              isSaved: true
            } as Tool;
          }
          return null;
        })
      );
      
      const validTools = savedToolsData.filter((tool): tool is Tool => tool !== null);
      setSavedTools(validTools);
      return validTools;
    } catch (error) {
      console.error('Error getting saved prompts:', error);
      return [];
    }
  };

  const addTool = async (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'saveCount' | 'ratingAvg' | 'ratingCount'>) => {
    if (!user) throw new Error('User must be authenticated to add a tool');
    try {
      const toolsRef = collection(db, 'tools');
      const now = Timestamp.now();
      const newTool: Omit<Tool, 'id'> = {
        ...tool,
        authorId: user.uid,
        createdAt: now,
        updatedAt: now,
        saveCount: 0,
        ratingAvg: 0,
        ratingCount: 0,
      };
      await addDoc(toolsRef, newTool);
      await getTools();
    } catch (error) {
      console.error('Error adding tool:', error);
      throw error;
    }
  };

  const updateTool = async (id: string, tool: Partial<Tool>) => {
    if (!user) throw new Error('User must be authenticated to update a tool');

    try {
      const toolRef = doc(db, 'tools', id);
      const toolDoc = await getDoc(toolRef);
      
      if (!toolDoc.exists()) {
        throw new Error('Tool not found');
      }

      if (toolDoc.data().authorId !== user.uid) {
        throw new Error('User is not authorized to update this tool');
      }

      await updateDoc(toolRef, {
        ...tool,
        updatedAt: serverTimestamp()
      });
      await getTools();
    } catch (error) {
      console.error('Error updating tool:', error);
      throw error;
    }
  };

  const deleteTool = async (id: string) => {
    if (!user) throw new Error('User must be authenticated to delete a tool');

    try {
      const toolRef = doc(db, 'tools', id);
      const toolDoc = await getDoc(toolRef);
      
      if (!toolDoc.exists()) {
        throw new Error('Tool not found');
      }

      if (toolDoc.data().authorId !== user.uid) {
        throw new Error('User is not authorized to delete this tool');
      }

      await deleteDoc(toolRef);
      await getTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      throw error;
    }
  };

  const saveTool = async (id: string) => {
    if (!user) throw new Error('User must be authenticated to save a tool');

    try {
      const toolRef = doc(db, 'tools', id);
      const userRef = doc(db, 'users', user.uid);
      const toolDoc = await getDoc(toolRef);
      
      if (!toolDoc.exists()) {
        throw new Error('Tool not found');
      }

      const userDoc = await getDoc(userRef);
      let savedTools: string[] = [];

      if (userDoc.exists()) {
        savedTools = userDoc.data()?.savedTools || [];
      } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          savedTools: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      const isSaved = savedTools.includes(id);

      if (isSaved) {
        await updateDoc(userRef, {
          savedTools: arrayRemove(id),
          updatedAt: serverTimestamp()
        });
        await updateDoc(toolRef, {
          saveCount: increment(-1),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(userRef, {
          savedTools: arrayUnion(id),
          updatedAt: serverTimestamp()
        });
        await updateDoc(toolRef, {
          saveCount: increment(1),
          updatedAt: serverTimestamp()
        });
      }

      // Refresh saved tools
      await getSavedPrompts();
    } catch (error) {
      console.error('Error saving tool:', error);
      throw error;
    }
  };

  const rateTool = async (id: string, rating: number) => {
    if (!user) throw new Error('User must be authenticated to rate a tool');
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

    try {
      const toolRef = doc(db, 'tools', id);
      const toolDoc = await getDoc(toolRef);
      
      if (!toolDoc.exists()) {
        throw new Error('Tool not found');
      }

      const toolData = toolDoc.data();
      const currentRatingAvg = toolData.ratingAvg || 0;
      const currentRatingCount = toolData.ratingCount || 0;
      const newRatingCount = currentRatingCount + 1;
      const newRatingAvg = ((currentRatingAvg * currentRatingCount) + rating) / newRatingCount;

      await updateDoc(toolRef, {
        ratingAvg: newRatingAvg,
        ratingCount: newRatingCount
      });

      await getTools();
    } catch (error) {
      console.error('Error rating tool:', error);
      throw error;
    }
  };

  const value = {
    tools,
    userTools,
    savedTools,
    featuredPrompts,
    trendingPrompts,
    getTools,
    getTool,
    getUserPrompts,
    getSavedPrompts,
    addTool,
    updateTool,
    deleteTool,
    saveTool,
    rateTool
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
};