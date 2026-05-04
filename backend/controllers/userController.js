const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get current logged-in user profile
// @route   GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Update current user profile (name, email, password)
// @route   PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc    Get all registered users (team directory)
// @route   GET /api/users/team
const getTeamMembers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

module.exports = { getMe, updateProfile, getTeamMembers };
