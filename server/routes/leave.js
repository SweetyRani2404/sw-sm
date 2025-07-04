const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Student applies for leave
router.post('/student/leave', auth, role('student'), leaveController.studentApplyLeave);
// Student views own leaves
router.get('/student/leaves', auth, role('student'), leaveController.getMyLeaves);
// Teacher views all pending leaves
router.get('/teacher/leaves', auth, role('teacher'), leaveController.getPendingLeaves);
// Teacher reviews (accepts/rejects) a leave
router.patch('/teacher/leave/:leaveId', auth, role('teacher'), leaveController.teacherReviewLeave);
// Admin views all leaves
router.get('/admin/leaves', auth, role('admin'), leaveController.getAllLeaves);

module.exports = router; 