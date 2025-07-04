const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance } = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Teacher: Mark attendance
router.post('/teacher/attendance', auth, role('teacher'), markAttendance);

// Student: View own attendance
router.get('/student/attendance', auth, role('student'), getMyAttendance);

module.exports = router; 