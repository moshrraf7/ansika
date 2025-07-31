import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type="login"
      />
    );
  }

  return children;
};

export default ProtectedRoute;