const express = require('express');

const router = express.Router();

const {
 getUsers, getUser, updateUser, updateUsersAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUsersAvatar);

module.exports = router;
