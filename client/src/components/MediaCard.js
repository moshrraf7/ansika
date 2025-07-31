import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiDownload, FiHeart } from 'react-icons/fi';

const MediaCard = ({ media, onPlay, onDownload, onLike, isLiked = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, scale: 1.02 }
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-square">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-pink-300 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageFailed ? (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <FiPlay size={32} className="mb-2" />
            <span className="text-sm">Failed to load</span>
          </div>
        ) : (
          <img
            src={media.url}
            alt={media.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Play button overlay for videos */}
        {media.isVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPlay && onPlay(media);
              }}
              className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlay size={24} className="text-gray-800 ml-1" />
            </motion.button>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onLike && onLike(media);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDownload && onDownload(media);
            }}
            className="p-2 bg-white bg-opacity-80 rounded-full backdrop-blur-sm text-gray-700 hover:bg-opacity-100 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload size={16} />
          </motion.button>
        </div>
      </div>

      {/* Media info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate mb-1">
          {media.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="capitalize">{media.category}</span>
          {media.isVideo && (
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">
              Video
            </span>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default MediaCard;