const express = require('express');
const router = express.Router();
const SwapReq = require('../Models/swapReq');
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

//  Create new swap request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { toUser, message } = req.body;
    
    // Check if target user exists
    const targetUser = await User.findById(toUser);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if user is trying to send request to themselves
    if (req.user.userId === toUser) {
      return res.status(400).json({ message: 'Cannot send swap request to yourself' });
    }

    // Check if request already exists
    const existingRequest = await SwapReq.findOne({
      fromUser: req.user.userId,
      toUser: toUser,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Swap request already sent to this user' });
    }

    const swapRequest = new SwapReq({
      fromUser: req.user.userId,
      toUser: toUser,
      message: message || "Let's swap some skills!"
    });

    await swapRequest.save();
    
    // Populate user details for response
    await swapRequest.populate('fromUser', 'name email');
    await swapRequest.populate('toUser', 'name email');

    res.status(201).json({
      message: 'Swap request sent successfully',
      swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error creating swap request' });
  }
});

//  Get user's swap requests sent and received
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', status } = req.query;
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

    if (status) {
      query.status = status;
    }

    const swapRequests = await SwapReq.find(query)
      .populate('fromUser', 'name email skillsOffered')
      .populate('toUser', 'name email skillsWanted')
      .sort({ createdAt: -1 });

    res.json(swapRequests);
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Server error getting swap requests' });
  }
});

//  Get specific swap request
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const swapRequest = await SwapReq.findById(req.params.id)
      .populate('fromUser', 'name email skillsOffered')
      .populate('toUser', 'name email skillsWanted');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is authorized to view this request
    if (swapRequest.fromUser._id.toString() !== req.user.userId && 
        swapRequest.toUser._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(swapRequest);
  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({ message: 'Server error getting swap request' });
  }
});

//  Update swap request status (accept/reject)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "accepted" or "rejected"' });
    }

    const swapRequest = await SwapReq.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only the recipient can update the status
    if (swapRequest.toUser.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the recipient can update swap request status' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request has already been processed' });
    }

    swapRequest.status = status;
    await swapRequest.save();

    await swapRequest.populate('fromUser', 'name email');
    await swapRequest.populate('toUser', 'name email');

    res.json({
      message: `Swap request ${status} successfully`,
      swapRequest
    });
  } catch (error) {
    console.error('Update swap request error:', error);
    res.status(500).json({ message: 'Server error updating swap request' });
  }
});

//  Delete swap request only sender can delete pending requests
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const swapRequest = await SwapReq.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only the sender can delete pending requests
    if (swapRequest.fromUser.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the sender can delete swap requests' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete processed swap requests' });
    }

    await SwapReq.findByIdAndDelete(req.params.id);

    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    console.error('Delete swap request error:', error);
    res.status(500).json({ message: 'Server error deleting swap request' });
  }
});

module.exports = router; 