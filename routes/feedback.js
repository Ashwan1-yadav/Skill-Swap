const express = require('express');
const router = express.Router();
const FeedBack = require('../Models/FeedBack');
const User = require('../Models/User');

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// POST /feedback - Create new feedback
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { toUser, message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    // Check if target user exists
    const targetUser = await User.findById(toUser);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if user is trying to send feedback to themselves
    if (req.user.userId === toUser) {
      return res.status(400).json({ message: 'Cannot send feedback to yourself' });
    }

    const feedback = new FeedBack({
      fromUser: req.user.userId,
      toUser: toUser,
      message: message.trim()
    });

    await feedback.save();
    
    // Populate user details for response
    await feedback.populate('fromUser', 'name email');
    await feedback.populate('toUser', 'name email');

    res.status(201).json({
      message: 'Feedback sent successfully',
      feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error creating feedback' });
  }
});

// GET /feedback - Get user's feedback (sent and received)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', limit = 20 } = req.query;
    let query = {};

    if (type === 'sent') {
      query.fromUser = req.user.userId;
    } else if (type === 'received') {
      query.toUser = req.user.userId;
    } else {
      // Get both sent and received
      query.$or = [
        { fromUser: req.user.userId },
        { toUser: req.user.userId }
      ];
    }

    const feedback = await FeedBack.find(query)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error getting feedback' });
  }
});

// GET /feedback/:id - Get specific feedback
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user is authorized to view this feedback
    if (feedback.fromUser._id.toString() !== req.user.userId && 
        feedback.toUser._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this feedback' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error getting feedback' });
  }
});

// PUT /feedback/:id - Update feedback (only sender can edit)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Feedback message is required' });
    }

    const feedback = await FeedBack.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Only the sender can edit feedback
    if (feedback.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the sender can edit feedback' });
    }

    feedback.message = message.trim();
    await feedback.save();

    await feedback.populate('fromUser', 'name email');
    await feedback.populate('toUser', 'name email');

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Server error updating feedback' });
  }
});

// DELETE /feedback/:id - Delete feedback (only sender can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Only the sender can delete feedback
    if (feedback.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the sender can delete feedback' });
    }

    await FeedBack.findByIdAndDelete(req.params.id);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error deleting feedback' });
  }
});

// GET /feedback/user/:userId - Get feedback for a specific user (public)
router.get('/user/:userId', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Check if target user exists and is public
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!targetUser.isPublicProfile) {
      return res.status(403).json({ message: 'User profile is private' });
    }

    const feedback = await FeedBack.find({ toUser: req.params.userId })
      .populate('fromUser', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(feedback);
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Server error getting user feedback' });
  }
});

module.exports = router; 