const jwt = require('jsonwebtoken');
require('dotenv').config()
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/auth/login');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/auth/login');
  }
};

module.exports = { requireAuth };