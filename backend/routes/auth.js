const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, getUserProfile, updateUserProfile,
  changePassword, bookmarkQuestion, removeBookmarkQuestion, getAllUsers
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.post('/bookmark/question/:id', protect, bookmarkQuestion);
router.delete('/bookmark/question/:id', protect, removeBookmarkQuestion);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;