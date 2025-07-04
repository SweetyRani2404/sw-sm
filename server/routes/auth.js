const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/login
// @desc    Login user and return JWT
router.post('/login', login);

// TEMPORARY: Auto-login as admin (for development only)
router.post('/dev-auto-login', async (req, res) => {
  let user = await User.findOne({ role: 'admin' });
  if (!user) {
    user = new User({
      name: 'Dev Admin',
      email: 'devadmin@example.com',
      password: 'dev', // Not used, just a placeholder
      role: 'admin'
    });
    await user.save();
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});

module.exports = router; 