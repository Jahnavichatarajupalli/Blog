const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');

// Load environment variables first
dotenv.config();

// Then import routes and passport
const authRoutes = require("./routes/auth");
const passport = require('./config/passport');
const blog=require("./routes/blogs")

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));
 
app.use("/api/auth", authRoutes);
app.use("/api/blogs",blog)


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
