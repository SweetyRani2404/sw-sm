const Notice = require('../models/Notice');

// Create a notice (admin/teacher)
exports.createNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    const notice = new Notice({
      title,
      content,
      createdBy: req.user.userId,
    });
    await notice.save();
    res.status(201).json({ message: 'Notice created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all notices (all users)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('createdBy', 'name role').sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 