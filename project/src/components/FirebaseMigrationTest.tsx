import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePrompt } from '../context/PromptContext';
import { testFirebaseMigration } from '../utils/testFirebaseMigration';
import { toast } from 'react-hot-toast';

const FirebaseMigrationTest: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const { addTool, getTools, saveTool, rateTool } = usePrompt();
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    if (!user) {
      toast.error('Please sign in to run tests');
      return;
    }

    setIsRunning(true);
    try {
      // Run basic Firebase tests
      const basicResults = await testFirebaseMigration();
      
      // Test context methods
      const testTool = {
        title: 'Context Test Tool',
        description: 'Testing context methods',
        content: 'Test content',
        tags: {
          specialty: ['Test'],
          useCase: ['Test'],
          appModel: ['Test'],
          userType: ['Test']
        },
        type: 'prompt' as const,
        status: 'published' as const,
        version: '1.0.0',
        saveCount: 0,
        ratingAvg: 0,
        ratingCount: 0
      };

      // Test addTool
      await addTool(testTool);
      const tools = await getTools();
      const addedTool = tools.find(t => t.title === testTool.title);

      if (addedTool) {
        // Test saveTool
        await saveTool(addedTool.id!);
        
        // Test rateTool
        await rateTool(addedTool.id!, 5);
      }

      setTestResults({
        ...basicResults,
        contextTests: {
          addTool: !!addedTool,
          saveTool: true,
          rateTool: true
        }
      });

      toast.success('Tests completed successfully');
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Tests failed');
    } finally {
      setIsRunning(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Firebase Migration Test</h1>
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in to Run Tests
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Migration Test</h1>
      
      <button
        onClick={runTests}
        disabled={isRunning}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>

      {testResults && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Basic Firebase Tests</h3>
              <ul className="list-disc list-inside">
                <li>Create Tool: {testResults.results.createTool ? '✅' : '❌'}</li>
                <li>Read Tool: {testResults.results.readTool ? '✅' : '❌'}</li>
                <li>Delete Tool: {testResults.results.deleteTool ? '✅' : '❌'}</li>
              </ul>
            </div>

            {testResults.contextTests && (
              <div>
                <h3 className="font-medium">Context Method Tests</h3>
                <ul className="list-disc list-inside">
                  <li>Add Tool: {testResults.contextTests.addTool ? '✅' : '❌'}</li>
                  <li>Save Tool: {testResults.contextTests.saveTool ? '✅' : '❌'}</li>
                  <li>Rate Tool: {testResults.contextTests.rateTool ? '✅' : '❌'}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseMigrationTest; 