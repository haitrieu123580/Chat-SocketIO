const userRoute = require('express').Router()
const User = require('../models/User')
const crypto = require('crypto')
// LOGIN
userRoute.post('/login', async (req, res) =>{
    const {username, password} = req.body;
    console.log(req.body.username);
    const user = await User.findOne({username: username, password: password})
    if(user){
        return res.render('chat',{user: user})
    }
    else{
        return res.json({message: 'user not found'})
    }
})
// REGISTER
userRoute.get('/register-page', (req, res) =>{
    return res.render('register-page')
})
userRoute.post('/register', async (req, res) =>{
    const newuser = new User(
        {
        username: req.body.username,
        password: req.body.password
        }
    )
    try {
        await newuser.save();
        return res.status(200).render('login')
    } catch (error) {
        return res.json({message:'error'})
    }
})
module.exports = userRoute