const mongoose = require('mongoose');

const ICONS = ['view_kanban', 'rocket_launch', 'bug_report', 'campaign', 'code', 'design_services', 'flag', 'star', 'bolt', 'inventory_2'];

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a board title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'view_kanban',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
