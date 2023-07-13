const express = require('express');
const celebrate = require('../middlewares/celebrate');

const router = express.Router();

const {
  getUsers, getUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', celebrate.validateUserId, getUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);
router.patch('/me/avatar', celebrate.validateUserAvatar, updateUsersAvatar);

module.exports = router;
