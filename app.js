const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '649c39b262b47a50e716715c',
  };

  next();
});

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
