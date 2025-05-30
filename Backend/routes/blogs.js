const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// Save or update draft
router.post('/save-draft', async (req, res) => {
    const { _id, title, content, tags, status } = req.body;

    try {
        if (_id) {
            // Update existing draft
            const updatedBlog = await Blog.findByIdAndUpdate(
                _id,
                { title, content, tags, status },
                { new: true }
            );
            return res.json(updatedBlog);
        } else {
            // Create new draft
            const newBlog = new Blog({ title, content, tags, status });
            const savedBlog = await newBlog.save();
            return res.json(savedBlog); // return _id to frontend
        }
    } catch (error) {
        console.error('Error saving draft:', error);
        return res.status(500).json({ message: 'Failed to save draft' });
    }
});


// Publish blog
router.post('/publish', async (req, res) => {
    const { _id, title, content, tags, status } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
        let blog;
        if (_id) {
            // Update existing blog
            blog = await Blog.findByIdAndUpdate(
                _id,
                { title, content, tags, status:"published" },
                { new: true }
            );
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found.' });
            }
        } else {
            // Create new blog
            blog = new Blog({ title, content, tags, status:"published" });
            await blog.save();
        }

        res.status(200).json(blog);
    } catch (err) {
        console.error('Publish error:', err);
        res.status(500).json({ error: 'Server error while publishing.' });
    }
});
router.get('/published', async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch published blogs' });
    }
});
router.get('/drafted', async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'draft' }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch drafted blogs' });
    }
});



// Get all blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get blog by ID
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;