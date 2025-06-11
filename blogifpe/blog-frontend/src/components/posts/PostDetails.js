import React, { useState, useEffect, Fragment } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './PostDetails.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`http://54.172.46.242:8081/posts/${id}/`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`http://54.172.46.242:8081/posts/${id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://54.172.46.242:8081/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await api.post(`http://54.172.46.242:8081/posts/${id}/comments/create`, {
        body: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
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
      <div className="post-detail">
        <div className="container container-md">
          <div className="post-loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="post-detail">
      <div className="container container-md">
        {/* Post Content */}
        <article className="card post-card">
          {post.image && (
            <img
              src={`http://54.172.46.242:8081${post.image}`}
              alt={post.title}
              className="post-hero-image"
            />
          )}
          <div className="post-header">
            <h1 className="post-title">
              {post.title}
            </h1>
            
            <div className="post-meta-info">
              <span className="post-meta-text">
                {formatDate(post.pub_date)} • by {post.author_name || `User ${post.author}`}
              </span>
              {post.category && (
                <span className="chip chip-primary">
                  {getCategoryName(post.category)}
                </span>
              )}
            </div>
          </div>
          
          <div className="post-body">
            {post.body}
          </div>
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <div className="comments-header">
            <h2 className="comments-title">
              Comments ({comments.length})
            </h2>
            
            {/* Add Comment Form */}
            {user ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  className="form-input comment-textarea"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                Please <a href="/login" className="login-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>login</a> to comment.
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                No comments yet.
              </div>
            ) : (
              <div>
                {comments.map((comment, index) => (
                  <div key={comment.id || index} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.author}
                      </span>
                      <span className="comment-date">
                        {formatDate(comment.pub_date)}
                      </span>
                    </div>
                    <div className="comment-body">
                      {comment.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;