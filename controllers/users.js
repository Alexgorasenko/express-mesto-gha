const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

const JWT_SECRET = 'super_strong_password';

const {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ message: "Email или пароль не могут быть пустыми" });

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(ERROR_INACCURATE_DATA).send({
            message: "Переданы некорректные данные при создании пользователя",
          });
        } else {
          res.status(ERROR_INTERNAL_SERVER).send({
            message: "Внутренняя ошибка сервера",
          });
        }
      });
  });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({
        message: "Внутренняя ошибка сервера",
      });
    });
};

const getUser = (req, res) => {
  const userId = req.params.id ? req.params.id : req.user._id;
  console.log(req.user._id, req.params.id);

  User.findById(userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_INACCURATE_DATA).send({
          message: "Переданы некорректные данные при поиске пользователя по id",
        });
      } else if (err.message === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({
          message: "Пользователь по указанному _id не найден",
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({
          message: "Внутренняя ошибка сервера",
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
      if (err.name === "ValidationError") {
        res.status(ERROR_INACCURATE_DATA).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else if (err.message === "Not Found") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь с указанным id не найден" });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "Внутренняя ошибка сервера" });
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

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });

  return User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).send({ message: 'Пользователь с таким Email не существует' });

      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) return res.status(401).send({ message: 'Пароль указан не верно' });

        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.cookie('jwt', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        });
        return res.send(token);
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUsersAvatar,
  login,
};
