const express = require('express');
const router = express.Router();
const { createTeacher, createStudent } = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST /api/admin/create-teacher
// @desc    Create a new teacher (admin only)
router.post('/create-teacher', auth, role('admin'), createTeacher);

// @route   POST /api/admin/create-student
// @desc    Create a new student (admin only)
router.post('/create-student', auth, role('admin'), createStudent);

// TEMPORARY: Create initial admin user
// Only for initial setup! Remove after use.
router.post('/create-initial-admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'admin' });
    await user.save();
    res.status(201).json({ message: 'Admin user created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all teachers (admin only)
router.get('/teachers', auth, role('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students (admin only)
router.get('/students', auth, role('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 