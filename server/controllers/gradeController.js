// Get grades for the logged-in student
exports.getMyGrades = async (req, res) => {
  try {
    const grades = await require('../models/Grade').find({ student: req.user.userId })
      .populate('gradedBy', 'name')
      .sort({ date: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 