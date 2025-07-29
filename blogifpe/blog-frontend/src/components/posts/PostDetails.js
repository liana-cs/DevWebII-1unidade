import React, { useState, useEffect } from 'react';
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

  // CRUD comentário
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchCategories();
    // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`http://3.222.27.148:8081/posts/${id}/`);
      setPost(response.data);
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`http://3.222.27.148:8081/posts/${id}/comments/`);
      setComments(response.data);
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://3.222.27.148:8081/categories/');
      setCategories(response.data);
    } catch {}
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await api.post(`http://3.222.27.148:8081/posts/${id}/comments/create`, {
        body: newComment
      });
      setNewComment('');
      fetchComments();
    } catch {}
  };

  // -------- CRUD EDIT/DELETE --------

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.body);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      await api.put(
        `http://3.222.27.148:8081/posts/${id}/comments/${commentId}/update`,
        { body: editCommentText }
      );
      setEditingComment(null);
      setEditCommentText('');
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(
        `http://3.222.27.148:8081/posts/${id}/comments/${commentId}/delete`
      );
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting comment');
    }
  };

  const canEditComment = (comment) =>
    user && (comment.author === user.username || comment.author_id === user.id);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) return <div className="post-loading"><div className="spinner"></div></div>;
  if (!post) return null;

  return (
    <div className="post-detail">
      <div className="container container-md">
        <article className="card post-card">
          {post.image && (
            <img
              src={`http://3.222.27.148:8081${post.image}`}
              alt={post.title}
              className="post-hero-image"
            />
          )}
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta-info">
              <span>
                {formatDate(post.pub_date)} • by {post.author_name || `User ${post.author}`}
              </span>
              {post.category && (
                <span className="chip chip-primary">
                  {getCategoryName(post.category)}
                </span>
              )}
            </div>
          </div>
          <div className="post-body">{post.body}</div>
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
              <div className="no-comments">No comments yet.</div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{formatDate(comment.pub_date)}</span>
                      {canEditComment(comment) && (
                        <span className="comment-actions">
                          {editingComment === comment.id ? (
                            <>
                              <button
                                className="btn btn-small btn-primary"
                                onClick={() => handleSaveEdit(comment.id)}
                                disabled={!editCommentText.trim()}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-small btn-outlined"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-small btn-text"
                                onClick={() => handleEditComment(comment)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-small btn-text btn-outlined"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="comment-body">
                      {editingComment === comment.id ? (
                        <textarea
                          className="form-input comment-edit-textarea"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          rows={3}
                        />
                      ) : (
                        comment.body
                      )}
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