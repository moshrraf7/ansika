import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AgeCheckModal from '../components/AgeCheckModal';
import VideoPlayer from '../components/VideoPlayer';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdult) {
      fetchVideos();
    } else {
      setShowAgeModal(true);
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/media/video');
      setVideos(response.data.media);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgeVerify = (isAdult) => {
    setShowAgeModal(false);
    if (!isAdult) {
      // Redirect or show access denied message
      alert('Access denied. You must be 18+ to view this content.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-12 text-pink-600"
      >
        Exclusive Videos
      </motion.h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <VideoPlayer video={video} />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{video.title}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showAgeModal && <AgeCheckModal onVerify={handleAgeVerify} />}
    </div>
  );
};

export default Videos;