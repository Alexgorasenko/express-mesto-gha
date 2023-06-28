const Card = require('../models/card');

const createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id, likes, createdAt,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(500).send({
          message: 'Внутренняя ошибка сервера',
        });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const deleteCard = (req, res) => {
  const { cardid } = req.params;
  Card.findByIdAndRemove(cardid)
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при удалении карточки',
          });
      } else if (err.message === 'Not Found') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const putLikeCard = (req, res) => {
  const { cardId } = req.params;
  console.log(req.params);
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для добавления лайка',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } })
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для добавления лайка',
          });
      } else if (err.message === 'Not Found') {
        res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
module.exports = {
  createCard,
  getCards,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
