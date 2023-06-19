const  express  = require("express");
const  Chats  = require("../models/Chat");

const  router  =  express.Router();

router.get('/', async(req, res) =>{
    try {
        const chat = await Chats.find()
        return res.status(200).json(chat)
    } catch (error) {
        console.log(error)
    }
})

module.exports  =  router;