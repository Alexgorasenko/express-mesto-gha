const express = require('express');

const mongoose = require('mongoose');

const app = express();

const cookieParser = require('cookie-parser');

const router = require('./routes/index');

const celebrate = require('./middlewares/celebrate');

const error = require('./middlewares/error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(cookieParser());
app.use(router);
app.use(celebrate)
app.use(error);


app.listen(3000, () => {
  console.log('Сервер запущен!');
});
