const route = require('express').Router();
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/authController')
route.post('/register', asyncHandler(authController.Register))
route.post('/login', asyncHandler(authController.Login))
module.exports = route