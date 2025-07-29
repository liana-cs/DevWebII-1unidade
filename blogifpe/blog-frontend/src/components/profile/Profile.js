import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, DeleteUser } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

    useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || ''
    });
    if (activeTab === 1) {
      fetchUserPosts();
    }
  }, [user, navigate, activeTab]);

  const fetchUserPosts = async () => {
    try {
      const response = await api.get('http://3.222.27.148:8081/user/user-posts/');
      setUserPosts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch('http://3.222.27.148:8081/user/user-panel/', formData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      setError('Error updating profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser=async () => {
    if (window.confirm('Are you sure you want to delete?')) {
      setDeleting(true); 
      const result = await DeleteUser();
      if (result.success) {
      alert('Success deleting your account!')
      navigate('/');
      } else {
      setError(result.error);
      setTimeout(()=>setError(''),3000)
      }
      setDeleting(false);
    }
  } 
  

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`http://3.222.27.148:8081/posts/${postId}/delete`);
        fetchUserPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container container-md">
        <div className="profile-container">
          <h1 className="profile-title">Profile</h1>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Tabs */}
          <div className="profile-tabs">
            <div className="profile-tabs-list">
              <button
                className={`profile-tab ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => handleTabChange(0)}
              >
                Profile Info
              </button>
              <button
                className={`profile-tab ${activeTab === 1 ? 'active' : ''}`}
                onClick={() => handleTabChange(1)}
              >
                My Posts
              </button>
            </div>
          </div>

          {/* Profile Info Tab */}
          {activeTab === 0 && (
            <div className="tab-content">
              {!editMode ? (
                <div>
                  <div className="profile-info-grid">
                    <div className="profile-field">
                      <span className="profile-field-label">Username</span>
                      <div className="profile-field-value">{user.username}</div>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Email</span>
                      <div className="profile-field-value">{user.email}</div>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">First Name</span>
                      <div className="profile-field-value">
                        {user.first_name || <span className="profile-field-empty">Not set</span>}
                      </div>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Last Name</span>
                      <div className="profile-field-value">
                        {user.last_name || <span className="profile-field-empty">Not set</span>}
                      </div>
                    </div>
                  </div>
                  <div className="profile-edit-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditMode(true)}
                    >
                      <span className="icon icon-edit"></span>
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleDeleteUser}
                    >
                      <span className="icon icon-delete"></span>
                      Delete Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile}>
                  <div className="profile-info-grid">
                    <div className="form-section">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        className="form-input"
                        value={formData.username}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div className="form-section">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-section">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        className="form-input"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-section">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        className="form-input"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="profile-edit-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* My Posts Tab */}
          {activeTab === 1 && (
            <div className="tab-content">
              <div className="posts-header">
                <h2 className="posts-title">
                  My Posts ({userPosts.length})
                </h2>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/create-post')}
                >
                  New Post
                </button>
              </div>

              {userPosts.length === 0 ? (
                <div className="no-posts">
                  You haven't created any posts yet.
                </div>
              ) : (
                <div className="posts-list">
                  {userPosts.map((post) => (
                    <div key={post.id} className="post-item">
                      <div className="post-item-content">
                        <div className="post-item-info">
                          <h3 className="post-item-title">
                            {post.title}
                          </h3>
                          <p className="post-item-preview">
                            {post.body.substring(0, 150)}...
                          </p>
                          <div className="post-item-date">
                            Created: {formatDate(post.pub_date)}
                          </div>
                        </div>
                        <div className="post-item-actions">
                          <button
                            className="action-btn view"
                            onClick={() => navigate(`/post/${post.id}`)}
                            title="View Post"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => navigate(`/edit-post/${post.id}`)}
                            title="Edit Post"
                          >
                            <span className="icon icon-edit"></span>
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                          >
                            <span className="icon icon-delete"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
    