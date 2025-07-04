const express = require('express');
const router = express.Router();
const { createNotice, getAllNotices } = require('../controllers/noticeController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Helper to allow multiple roles
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

// Create a notice (admin/teacher only)
router.post('/notices', auth, allowRoles('admin', 'teacher'), createNotice);

// Get all notices (all users)
router.get('/notices', auth, getAllNotices);

module.exports = router; 