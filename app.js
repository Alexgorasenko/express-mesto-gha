const express = require('express');

const mongoose = require('mongoose');

const app = express();

const router = require('./routes/index');

const error = require('./middlewares/error');

const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(cookieParser());
app.use(router);
app.use(error);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
