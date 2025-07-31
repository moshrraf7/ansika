import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import AuthProvider from './context/AuthContext';
import ChatProvider from './context/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import AgeRestrictedRoute from './components/AgeRestrictedRoute';
import FloatingChatButton from './components/FloatingChatButton';
import PageLoader from './components/PageLoader';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <AnimatePresence mode='wait'>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery/:category" element={<Gallery />} />
                <Route path="/videos" element={
                  <ProtectedRoute>
                    <AgeRestrictedRoute>
                      <Videos />
                    </AgeRestrictedRoute>
                  </ProtectedRoute>
                } />
              </Routes>
              <FloatingChatButton />
              <PageLoader />
            </div>
          </AnimatePresence>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;