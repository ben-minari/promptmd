import { useState, useEffect } from 'react';
import { Tool } from '../types';
import { collection, getDocs, getFirestore, query, where, orderBy, limit } from 'firebase/firestore';
import { app } from '../config/firebase';

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const db = getFirestore(app);
        const toolsQuery = query(
          collection(db, 'tools'),
          where('status', '==', 'published'),
          where('type', '==', 'prompt'),
          orderBy('updatedAt', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(toolsQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tool[];
        setTools(data);
        setError(null);
      } catch (err) {
        console.error('Error loading tools:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  return { tools, loading, error };
}; 