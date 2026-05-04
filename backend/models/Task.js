const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    column: {
      type: String,
      required: [true, 'Please specify a column for the task'],
      default: 'backlog',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    labels: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
