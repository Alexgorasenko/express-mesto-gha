const express = require('express');

const router = express.Router();

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/celebrate');

const {
  createCard, getCards, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.post('/', validateCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardid', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, putLikeCard);
router.delete('/:cardId/likes', validateCardId, deleteLikeCard);
module.exports = router;
