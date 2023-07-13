const Card = require('../models/card');

const  BadRequestError = require("../utils/BadRequestError");

const  ConflictingError = require("../utils/ConflictingError");

const  ForbiddenError = require("../utils/ForbiddenError");

const  NotFoundError = require("../utils/NotFoundError");

const  UnauthorizedError = require("../utils/UnauthorizedError");

const createCard = (req, res, next) => {

  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardid } = req.params;
  Card.findById(cardid)
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Отсутствие прав для удаления данной карточки');
      } else {
        Card.deleteOne(card).then((removeCard) => res.send(removeCard));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};


const putLikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .orFail(new NotFoundError('Передан несуществующий id карточки'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для добавления лайка'));
      } else {
        next(err);
      }
    });
};

const deleteLikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
  .orFail(new NotFoundError('Передан несуществующий id карточки'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
      } else {
        next(err);
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
