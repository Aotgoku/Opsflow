const Board = require('../models/Board');
const Task = require('../models/Task');

// @desc    Get all boards for the logged-in user (owned or member)
// @route   GET /api/boards
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    // Attach task counts
    const boardsWithCounts = await Promise.all(
      boards.map(async (board) => {
        const taskCount = await Task.countDocuments({ board: board._id });
        return { ...board.toObject(), taskCount };
      })
    );

    res.json(boardsWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching boards', error: error.message });
  }
};

// @desc    Create a new board
// @route   POST /api/boards
const createBoard = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Board title is required' });
    }

    const board = await Board.create({
      title,
      description: description || '',
      icon: icon || 'view_kanban',
      owner: req.user.id,
      members: [req.user.id],
    });

    const populated = await Board.findById(board._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.status(201).json({ ...populated.toObject(), taskCount: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating board', error: error.message });
  }
};

// @desc    Get a single board by ID
// @route   GET /api/boards/:id
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check access
    const isMember = board.members.some((m) => m._id.toString() === req.user.id);
    const isOwner = board.owner._id.toString() === req.user.id;
    if (!isMember && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching board', error: error.message });
  }
};

// @desc    Update a board
// @route   PUT /api/boards/:id
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this board' });
    }

    const updated = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating board', error: error.message });
  }
};

// @desc    Delete a board and all its tasks
// @route   DELETE /api/boards/:id
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this board' });
    }

    // Delete all tasks associated with this board
    await Task.deleteMany({ board: req.params.id });

    await board.deleteOne();

    res.json({ id: req.params.id, message: 'Board and its tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting board', error: error.message });
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};
