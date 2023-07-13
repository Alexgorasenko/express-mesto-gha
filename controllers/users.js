const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;

const JWT_SECRET = 'super_strong_password';

const BadRequestError = require('../utils/BadRequestError');

const ConflictingError = require('../utils/ConflictingError');

const NotFoundError = require('../utils/NotFoundError');

const UnauthorizedError = require('../utils/UnauthorizedError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        res.send(user._id, user.name, user.about, user.avatar, user.email);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        } else if (err.code === 11000) {
          next(new ConflictingError('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      });
  });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.params.id ? req.params.id : req.user._id;

  User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя по id'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUserData = (Name, data, req, res, next) => {
  Name.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateUserData(User, { name, about }, req, res, next);
};

const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserData(User, { avatar }, req, res, next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Неверный логин или пароль'))
    .then((user) => {
      bcrypt
        .compare(password, user.password, (err, isValidPassword) => {
          if (isValidPassword) {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET);
            res.cookie('jwt', token, {
              maxAge: 3600 * 24 * 7,
              httpOnly: true,
            });
            res.send(token);
          } else {
            throw new UnauthorizedError('Неверный логин или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUsersAvatar,
  login,
};
