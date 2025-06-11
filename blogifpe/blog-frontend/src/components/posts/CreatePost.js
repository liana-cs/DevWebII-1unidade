import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    image: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://54.172.46.242:8081/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('body', formData.body);
      submitData.append('slug', generateSlug(formData.title));
      
      if (formData.category) {
        submitData.append('category', formData.category);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
    /* global localStorage */
      const response = await api.post('http://54.172.46.242:8081/posts/create/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate(`/post/${response.data.id}`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="create-post">
      <div className="container container-md">
        <div className={`create-post-form ${loading ? 'form-loading' : ''}`}>
          <h1 className="form-title">Create New Post</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-section">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label className="form-label">Content *</label>
              <textarea
                name="body"
                className="form-input form-textarea form-textarea-large"
                value={formData.body}
                onChange={handleChange}
                required
              />
            </div>

            <div className="file-upload-section">
              <label className="btn btn-outlined file-upload-btn">
                Upload Image (Optional)
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-upload-input"
                />
              </label>
              {formData.image && (
                <div className="file-selected">
                  Selected: {formData.image.name}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !formData.title || !formData.body}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </button>
              <button
                type="button"
                className="btn btn-outlined"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
