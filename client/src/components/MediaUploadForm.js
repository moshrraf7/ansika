import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MediaUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'beauty',
    isVideo: false,
    mediaFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, mediaFile: file });

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mediaFile) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('isVideo', formData.isVideo);
      data.append('media', formData.mediaFile);

      const response = await axios.post('/api/media', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log('Upload successful:', response.data);
      setUploadSuccess(true);
      setFormData({
        title: '',
        category: 'beauty',
        isVideo: false,
        mediaFile: null,
      });
      setPreview(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="beauty">Beauty</option>
          <option value="beach">Beach</option>
          <option value="hot">Hot</option>
          <option value="cutie">Cutie</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isVideo"
          checked={formData.isVideo}
          onChange={handleChange}
          className="h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
        />
        <label className="ml-2 text-gray-700">Is this a video?</label>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Media File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            {preview ? (
              formData.isVideo ? (
                <video src={preview} controls className="h-full" />
              ) : (
                <img src={preview} alt="Preview" className="h-full object-cover" />
              )
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">Click to upload</p>
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept={formData.isVideo ? 'video/*' : 'image/*'}
              required
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition flex items-center justify-center"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          'Upload Media'
        )}
      </button>

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 text-green-700 rounded-lg"
        >
          Media uploaded successfully!
        </motion.div>
      )}
    </motion.form>
  );
};

export default MediaUploadForm;