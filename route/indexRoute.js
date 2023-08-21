const { requireAuth } = require('../middleware/authMiddleware')
const indexRoute = require('express').Router()
// Index page
indexRoute.get('',requireAuth, (req, res) =>{
    return res.render('chat',{user: req.user})
})
// Reigster
indexRoute.get('/register-page', (req, res) =>{
    return res.render('register-page')
})

module.exports = indexRoute