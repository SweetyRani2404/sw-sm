const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create Teacher
exports.createTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'teacher' });
    await user.save();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Student
exports.createStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'student' });
    await user.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 