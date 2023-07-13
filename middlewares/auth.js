const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload
  console.log(token);

  try {
    payload = jwt.verify(token, 'super_strong_password');
  } catch (err) {
    return res.status(401).send({ message: 'Неверный логин или пароль' });
  }

  req.user = payload;

  return next();
};

module.exports = { auth };