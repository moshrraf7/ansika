import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import MediaUploadForm from '../components/MediaUploadForm';
import AdminMediaList from '../components/AdminMediaList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-pink-200">Welcome back, {user.email}</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-medium ${activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600'}`}
          >
            Upload Media
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 font-medium ${activeTab === 'manage' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600'}`}
          >
            Manage Media
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' ? (
            <MediaUploadForm />
          ) : (
            <AdminMediaList />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;