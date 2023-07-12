const express = require('express');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const {createUser, login} = require('../controllers/users');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/signin', login);
router.use('/signup', createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

router.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
