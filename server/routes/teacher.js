const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails } = require('../controllers/teacherController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Get all students
router.get('/students', auth, role('teacher'), getAllStudents);

// Get details for a specific student
router.get('/students/:id', auth, role('teacher'), getStudentDetails);

module.exports = router; 