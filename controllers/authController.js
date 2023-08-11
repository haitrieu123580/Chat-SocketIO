require('dotenv').config();
const User = require('../models/User');
const hash = require('../helper/hash');
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto')

const Register = async (req, res) => {
    const { username, password } = req.body;
    try {
        //Check existed user
        const isExist = await User.findOne({ username: username });
        if (isExist) {
            return res.status(404).send('User already existed');
        }
        //Hashing password and create new doc
        const { salt, encryptedPassword } = hash.hashedPassword(password);
        const user = new User({
            username: username,
            password: encryptedPassword,
            salt: salt
        });
        await user.save()
        return res.redirect('/')
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }

};
const Login = async (req, res) => {
    // create json web token
    const maxAge = 3 * 24 * 60 * 60;
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({ username: username })
        // Case 1: User does not exist
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        // Case 2: Found user with that username
        const isPasswordMatch = hash.comparePassword({
            input: password,
            encryptedPassword: user.password,
            salt: user.salt,
        });
        if (isPasswordMatch) {
            // await cacheService.setOneUser(user.id);
            data = {
                username: user.username,
            }
            const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1d',
            });
            // Set the JWT cookie
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            // console.log(res.cookie.jwt);
            // Redirect the user to the /index page
            return res.status(200).json({data:token})
            // return res.redirect('/index')

        } else {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error' })
    }

};
module.exports = {
    Register,
    Login
}