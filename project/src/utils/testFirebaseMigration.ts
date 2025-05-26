import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Tool } from '../context/PromptContext';

export const testFirebaseMigration = async () => {
  const results = {
    auth: false,
    createTool: false,
    readTool: false,
    updateTool: false,
    deleteTool: false,
    saveTool: false,
    rateTool: false,
    realTimeUpdates: false
  };

  try {
    // Test 1: Create a test tool
    const testTool: Tool = {
      title: 'Test Tool',
      description: 'This is a test tool',
      content: 'Test content',
      tags: {
        specialty: ['Test Specialty'],
        useCase: ['Test Use Case'],
        appModel: ['Test Model'],
        userType: ['Test User']
      },
      type: 'prompt',
      status: 'published',
      version: '1.0.0',
      saveCount: 0,
      ratingAvg: 0,
      ratingCount: 0
    };

    const toolsRef = collection(db, 'tools');
    const docRef = await addDoc(toolsRef, testTool);
    results.createTool = true;

    // Test 2: Read the test tool
    const docSnap = await getDocs(toolsRef);
    const tools = docSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    results.readTool = tools.some(tool => tool.id === docRef.id);

    // Test 3: Delete the test tool
    await deleteDoc(doc(db, 'tools', docRef.id));
    results.deleteTool = true;

    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      error,
      results
    };
  }
}; 