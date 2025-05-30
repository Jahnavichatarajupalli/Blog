const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET
    );

    // Respond with the token
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email } = payload;

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10) // random password for Google users
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});
// Add forgot password route

// Update the forgot-password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Instead of sending email, return the token
    res.json({ 
      message: 'User verified',
      resetToken,
      success: true 
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
});

// Add reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
