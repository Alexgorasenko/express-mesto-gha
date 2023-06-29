const User = require('../models/user');

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INACCURATE_DATA).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INACCURATE_DATA).send({
          message: 'Переданы некорректные данные при поиске пользователя по id',
        });
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const updateUserData = (Name, data, req, res) => {
  Name.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INACCURATE_DATA)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  updateUserData(User, { name, about }, req, res);
};

const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserData(User, { avatar }, req, res);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUsersAvatar,
};
