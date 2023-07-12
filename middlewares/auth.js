const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.cookie;
  console.log(token);

  let payload;

  try {
    payload = jwt.verify(token, 'super_strong_password');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

module.exports = { auth };