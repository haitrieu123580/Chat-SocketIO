const route = require('express').Router();
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/authController');
// const verifyJWT = require('../middleware/verifyJWT');
route.get('/login', (req, res) => res.render('login'))
route.post('/register', asyncHandler(authController.Register));
route.post('/login', asyncHandler(authController.Login));
module.exports = route