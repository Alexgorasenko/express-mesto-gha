const express = require('express');

const mongoose = require('mongoose');

const app = express();

const router = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649c39b262b47a50e716715c',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
