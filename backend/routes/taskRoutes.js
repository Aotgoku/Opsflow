const express = require('express');
const router = express.Router();
const { getTasks, createTask, deleteTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Route for getting all tasks and creating a new task
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

// Route for deleting and updating a specific task by ID
router.route('/:id')
  .delete(protect, deleteTask)
  .patch(protect, updateTask);

module.exports = router;
