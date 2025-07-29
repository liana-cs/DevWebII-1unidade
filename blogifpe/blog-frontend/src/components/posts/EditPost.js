import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    image: null
  });
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPost();
    fetchCategories();
  }, [user, navigate, id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`http://3.222.27.148:8081/posts/${id}/`);
      const post = response.data;
      
      setFormData({
        title: post.title,
        body: post.body,
        category: post.category || '',
        image: null
      });
      setCurrentImage(post.image);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/profile');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://3.222.27.148:8081/categories/');
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

      await api.put(`/posts/${id}/update`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Post updated successfully!');
      setTimeout(() => {
        navigate(`/post/${id}`);
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="edit-post">
      <div className="container container-md">
        <div className={`edit-post-form ${loading ? 'form-loading' : ''}`}>
          <h1 className="form-title">Edit Post</h1>

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

            {currentImage && (
              <div className="current-image-section">
                <span className="current-image-label">
                  Current Image:
                </span>
                <img
                  src={`http://3.222.27.148:8081${currentImage}`}
                  alt="Current"
                  className="current-image"
                />
              </div>
            )}

            <div className="file-upload-section">
              <label className="btn btn-outlined file-upload-btn">
                Change Image (Optional)
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-upload-input"
                />
              </label>
              {formData.image && (
                <div className="new-image-selected">
                  New image selected: {formData.image.name}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  'Update Post'
                )}
              </button>
              <button
                type="button"
                className="btn btn-outlined"
                onClick={() => navigate('/profile')}
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

export default EditPost;