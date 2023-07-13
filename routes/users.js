const express = require('express');
const {
  validateUserId,
  validateUpdateUser,
  validateUserAvatar,
} = require('../middlewares/celebrate');

const router = express.Router();

const {
  getUsers, getUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', validateUserId, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateUsersAvatar);

module.exports = router;
