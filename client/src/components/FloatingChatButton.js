import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { FaComment, FaTimes } from 'react-icons/fa';

const FloatingChatButton = () => {
  const { chatOpen, setChatOpen } = useChat();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        {chatOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaComment className="text-2xl" />
        )}
      </button>
    </motion.div>
  );
};

export default FloatingChatButton;