const express = require('express');

const mongoose = require('mongoose');

const app = express();

const router = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
