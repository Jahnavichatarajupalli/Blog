const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
}, {
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" 
    }
});

module.exports = mongoose.model("Blog", blogSchema);