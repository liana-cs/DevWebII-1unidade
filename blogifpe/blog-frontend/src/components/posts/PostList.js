import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('http://3.222.27.148:8081/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPosts();
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`http://3.222.27.148:8081/posts/search/?search=${searchTerm}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="post-list">
        <div className="container">
          <div className="posts-loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="container">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-form">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn btn-primary search-btn"
              onClick={handleSearch}
            >
              <span className="icon icon-search"></span>
              Search
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="no-posts">
            No posts found
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="card post-card">
                {post.image && (
                  <img
                    src={`http://3.222.27.148:8081/${post.image}`}
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <div className="post-content">
                  <h2 className="post-title">
                    {post.title}
                  </h2>
                  <p className="post-preview">
                    {post.body.substring(0, 150)}...
                  </p>
                  
                  <div className="post-category">
                    {post.category && (
                      <span className="chip chip-small chip-primary">
                        {getCategoryName(post.category)}
                      </span>
                    )}
                  </div>
                  
                  <div className="post-meta">
                    {formatDate(post.pub_date)} • by {post.author_name || `User ${post.author}`}
                  </div>
                </div>
                <div className="post-actions">
                  <button 
                    className="btn btn-outlined btn-fullwidth"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;