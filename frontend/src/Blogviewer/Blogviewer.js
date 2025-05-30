// BlogViewer.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Blogviewer.css';

const apiUrl = 'http://localhost:5000';

const BlogViewer = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div className="blog-viewer">Loading...</div>;

  return (
    <div className="blog-viewer">
      <h1>{blog.title}</h1>
      <div className="blog-meta">
        {blog.tags?.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogViewer;
