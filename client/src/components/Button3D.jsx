import React from 'react';
import { motion } from 'framer-motion';

const Button3D = ({ icon, text, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center h-24"
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </motion.button>
  );
};

export default Button3D;