import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Heart } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import Button3D from '../components/Button3D';

const Home = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');

  const categories = [
    { name: 'Beauty', icon: '📸', path: 'beauty' },
    { name: 'Beach', icon: '🌊', path: 'beach' },
    { name: 'Hot', icon: '🔥', path: 'hot' },
    { name: 'Cutie', icon: '💕', path: 'cutie' },
    { name: 'Video', icon: '🎥', path: 'videos' },
  ];

  const handleCategoryClick = (path) => {
    if (path === 'videos') {
      setShowAuthModal(true);
      setAuthType('login');
    } else {
      navigate(`/gallery/${path}`);
    }
  };

  const AnimatedHeart = () => {
    const { scale } = useSpring({
      loop: true,
      to: [{ scale: 1.2 }, { scale: 1 }],
      from: { scale: 1 },
      config: { duration: 1000 },
    });

    return (
      <a.mesh scale={scale}>
        <Heart args={[1, 1, 1]} color="#FF6B6B" />
      </a.mesh>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl mb-6"
      >
        <img 
          src="/profile.jpg" 
          alt="Anshika" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-4xl md:text-5xl font-stylish italic text-pink-600 mb-4"
      >
        Anshika
      </motion.h1>

      {/* Love Quotes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-md mb-8 text-gray-700"
      >
        <p className="mb-2">"Love is not about possession, it's about appreciation."</p>
        <p>"You are the poem I never knew how to write."</p>
      </motion.div>

      {/* Animated Heart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="w-20 h-20 mb-8"
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedHeart />
        </Canvas>
      </motion.div>

      {/* Category Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-2xl"
      >
        {categories.map((category, index) => (
          <Button3D
            key={index}
            icon={category.icon}
            text={category.name}
            onClick={() => handleCategoryClick(category.path)}
          />
        ))}
      </motion.div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        type={authType}
        onSwitchType={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
      />
    </div>
  );
};

export default Home;