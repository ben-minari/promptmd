import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import BrowsePromptsPage from './pages/BrowsePromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import CreatePromptPage from './pages/CreatePromptPage';
import ProfilePageWithModal from './pages/ProfilePageWithModal';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

// Context provider
import { AuthProvider } from './context/AuthContext';
import { PromptProvider } from './context/PromptContext';
import PromptTest from './components/PromptTest';
import FirebaseMigrationTest from './components/FirebaseMigrationTest';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <AuthProvider>
      <PromptProvider>
        <SearchProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="browse" element={<BrowsePromptsPage />} />
                <Route path="prompts/:id" element={<PromptDetailPage />} />
                <Route path="create" element={<CreatePromptPage />} />
                <Route path="profile" element={<ProfilePageWithModal />} />
              </Route>
              <Route path="/test" element={<PromptTest />} />
              <Route path="/migration-test" element={<FirebaseMigrationTest />} />
            </Routes>
          </Router>
        </SearchProvider>
      </PromptProvider>
    </AuthProvider>
  );
}

export default App;