import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Loader from '../components/Loader';
import MediaCard from '../components/MediaCard';

const Gallery = () => {
  const { category } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/media/${category}`);
        setMedia(response.data.media);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [category]);

  const categoryTitles = {
    beauty: 'Beauty Gallery',
    beach: 'Beach Gallery',
    hot: 'Hot Gallery',
    cutie: 'Cutie Gallery',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-pink-600"
      >
        {categoryTitles[category] || 'Gallery'}
      </motion.h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <MediaCard media={item} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;