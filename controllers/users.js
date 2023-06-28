const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({
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
      res.status(500).send({
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
        res.status(400).send({
          message: 'Переданы некорректные данные при поиске пользователя по id',
        });
      } else if (err.message === 'Not Found') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUsersAvatar,
};
