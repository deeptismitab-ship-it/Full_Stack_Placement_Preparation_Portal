const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, college, branch, year } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      college,
      branch,
      year
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      branch: user.branch,
      year: user.year,
      skills: user.skills,
      avatar: user.avatar,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, college, branch, year, skills, avatar } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (college) user.college = college;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (skills) user.skills = skills;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      branch: user.branch,
      year: user.year,
      skills: user.skills,
      avatar: user.avatar,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add question to bookmarks
// @route   POST /api/auth/bookmark/question/:id
const bookmarkQuestion = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let bookmarks = user.bookmarkedQuestions || [];
    if (bookmarks.includes(parseInt(req.params.id))) {
      return res.status(400).json({ message: 'Question already bookmarked' });
    }

    bookmarks.push(parseInt(req.params.id));
    user.bookmarkedQuestions = bookmarks;
    await user.save();

    res.json({ message: 'Question bookmarked successfully' });
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove question from bookmarks
// @route   DELETE /api/auth/bookmark/question/:id
const removeBookmarkQuestion = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let bookmarks = user.bookmarkedQuestions || [];
    bookmarks = bookmarks.filter(id => id !== parseInt(req.params.id));
    user.bookmarkedQuestions = bookmarks;
    await user.save();

    res.json({ message: 'Question removed from bookmarks' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ 
      where: { role: 'student' },
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  bookmarkQuestion,
  removeBookmarkQuestion,
  getAllUsers
};