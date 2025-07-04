const express = require('express');
const router = express.Router();
const { getMyGrades } = require('../controllers/gradeController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
// You can add grades routes here later

// Student: View own grades
router.get('/student/grades', auth, role('student'), getMyGrades);

module.exports = router; 