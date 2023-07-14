const error = (err, req, res, next) => {
  if (!err.status) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

module.exports = error;
