import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AgeCheckModal = ({ onVerify }) => {
  const [isAdult, setIsAdult] = useState(null);
  const { verifyAge } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyAge(isAdult);
    onVerify(isAdult);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-pink-600 mb-4">Age Verification</h2>
        <p className="mb-6">You must be 18+ to access this content</p>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsAdult(true)}
            className={`flex-1 py-2 rounded-lg ${isAdult === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Yes, I'm 18+
          </button>
          <button
            onClick={() => setIsAdult(false)}
            className={`flex-1 py-2 rounded-lg ${isAdult === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            No, I'm under 18
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isAdult === null}
          className={`w-full py-2 rounded-lg text-white ${isAdult === null ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'}`}
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AgeCheckModal;