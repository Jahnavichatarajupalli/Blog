// PublishedBlogs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DraftedBlogs.css';
import { useNavigate } from 'react-router-dom';

const apiUrl = 'http://localhost:5000';

const DraftedBlogs = ({ onEdit }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/drafted`);
        setBlogs(res.data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };

    fetchBlogs();
  }, []);
  const navigate=useNavigate()

  return (
    <div className="main-content">
      <h2 className="welcome-text">Drafted Blogs</h2>
      <div className="blogs-grid">
        {blogs.length === 0 ? (
          <p style={{ color: '#ccc' }}>No drafted blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id}   onClick={() => navigate(`/blog/${blog._id}`)}className="blog-card">
              <h3>{blog.title}</h3>
              <div
                className="blog-content-preview"
                dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 200) + '...' }}
              />
              <div className="tags">
                {blog.tags?.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                className="edit-button"
                onClick={(e) => {e.stopPropagation();
navigate(`/editor/${blog._id}`)}}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                }}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DraftedBlogs;
