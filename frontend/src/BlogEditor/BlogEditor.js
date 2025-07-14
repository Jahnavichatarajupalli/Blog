import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './BlogEditor.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = process.env.REACT_APP_API_URL;

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blog, setBlog] = useState({
    title: '',
    content: '',
    tags: [],
    status: 'draft',
  });

  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const isFirstRender = useRef(true);
  const lastAutoSavedData = useRef({ title: '', content: '' });
  const debouncedSaveRef = useRef(null);

  // Fetch blog by ID if editing
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blogs/${id}`);
        const blogData = res.data;
        setBlog({
          _id: blogData._id,
          title: blogData.title,
          content: blogData.content,
          tags: blogData.tags || [],
          status: blogData.status || 'draft',
        });
        setTagInput((blogData.tags || []).join(', '));
      } catch (err) {
        console.error('Failed to load blog:', err);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Define debounced save once
  useEffect(() => {
    debouncedSaveRef.current = debounce(async () => {
      if (
        !blog.title.trim() ||
        !blog.content.trim() ||
        (blog.title === lastAutoSavedData.current.title &&
         blog.content === lastAutoSavedData.current.content)
      ) {
        return;
      }

      try {
        setSaving(true);
        const response = await axios.post(`${apiUrl}/api/blogs/save-draft`, blog);
        if (response.data._id) {
          setBlog((prev) => ({ ...prev, _id: response.data._id }));
        }
        setLastSaved(new Date());
        lastAutoSavedData.current = {
          title: blog.title,
          content: blog.content,
        };
        toast.success('Draft auto-saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        toast.error('Auto-save failed');
      } finally {
        setSaving(false);
      }
    }, 3000);
  }, [blog]);

  // Trigger auto-save only on title/content change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current();
    }
  }, [blog.title, blog.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setBlog((prev) => ({ ...prev, content }));
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    const tagList = value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setBlog((prev) => ({ ...prev, tags: tagList }));
  };

  const handlePublish = async () => {
    if (!blog.title.trim() || !blog.content.trim()) {
      alert('Please complete the draft first.');
      return;
    }

    try {
      blog.status = 'published';
      await axios.post(`${apiUrl}/api/blogs/publish`, blog);

      setBlog({
        title: '',
        content: '',
        tags: [],
        status: 'draft',
      });
      setTagInput('');

      toast.success('Blog published successfully!', {
        onClose: () => navigate('/dashboard'),
        autoClose: 2000,
      });
    } catch (err) {
      console.error('Publish error:', err);
      toast.error('Failed to publish the blog');
    }
  };

  return (
    <div className="blog-editor">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop />

      <div className="editor-header">
        <input
          name="title"
          placeholder="Enter title"
          value={blog.title}
          onChange={handleChange}
          className="title-input"
        />
        <div className="editor-actions">
          {saving && <span className="saving-status">Saving...</span>}
          {lastSaved && (
            <span className="last-saved">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          <button
            onClick={handlePublish}
            disabled={saving}
            className="publish-button"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <Editor
        apiKey="2boq4nnwfj18756tdx231eha01lacr66popta156fu5ttrc0"
        value={blog.content}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: true,
          plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap'],
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
          skin: 'oxide-dark',
          content_css: 'dark',
          content_style: `body { background-color: #000; color: #fff; padding: 1rem; }`,
        }}
      />

      <div className="tags-section">
        <input
          name="tags"
          value={tagInput}
          onChange={handleTagChange}
          placeholder="Enter tags (comma separated)"
          className="tags-input"
        />
      </div>
    </div>
  );
};

export default BlogEditor;


