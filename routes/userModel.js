const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User registration
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, location, skillsOffered, skillsWanted, availability } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, password: hashedPassword, location, skillsOffered, skillsWanted, availability
    });

    await user.save();
    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name, email, location, skillsOffered, skillsWanted, availability }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

//  User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

//Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, skillsOffered, skillsWanted, availability, isPublicProfile } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (skillsOffered) updateData.skillsOffered = skillsOffered;
    if (skillsWanted) updateData.skillsWanted = skillsWanted;
    if (availability) updateData.availability = availability;
    if (typeof isPublicProfile === 'boolean') updateData.isPublicProfile = isPublicProfile;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

//  Delete user account
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

//  Get all public users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isPublicProfile: true }).select('-password -email').limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//  Get specific user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isPublicProfile) return res.status(403).json({ message: 'Profile is private' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 