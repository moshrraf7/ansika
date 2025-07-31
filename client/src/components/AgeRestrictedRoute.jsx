import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AgeCheckModal from './AgeCheckModal';

const AgeRestrictedRoute = ({ children }) => {
  const { user } = useAuth();
  const [showAgeModal, setShowAgeModal] = useState(!user?.isAdult);

  if (!user?.isAdult) {
    return (
      <AgeCheckModal 
        isOpen={showAgeModal}
        onClose={() => setShowAgeModal(false)}
      />
    );
  }

  return children;
};

export default AgeRestrictedRoute;