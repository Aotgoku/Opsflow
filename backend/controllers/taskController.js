const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get all tasks for logged in user, optionally filtered by board
// @route   GET /api/tasks?boardId=xxx
const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.boardId) {
      // Validate boardId is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(req.query.boardId)) {
        filter.board = req.query.boardId;
      } else {
        return res.status(400).json({ message: 'Invalid boardId' });
      }
    }

    const tasks = await Task.find(filter).populate('board', 'title').sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, column, boardId, description, priority, dueDate, labels } = req.body;

    if (!title || !column) {
      return res.status(400).json({ message: 'Please provide both title and column' });
    }

    const newTask = await Task.create({
      title,
      column,
      board: boardId && mongoose.Types.ObjectId.isValid(boardId) ? boardId : null,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      labels: labels || [],
      user: req.user.id,
    });

    const populated = await Task.findById(newTask._id).populate('board', 'title');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// @desc    Update a task (column, priority, title, etc.)
// @route   PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Prevent user from being changed
    const { user, ...updateData } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('board', 'title');

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};
