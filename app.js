require('dotenv').config()
const Chat = require('./models/Chat')
//Require the express moule
const express = require('express');

//create a new express application
const app = express()

//require the http module
const http = require('http').Server(app)

// require the socket.io module
const io = require('socket.io');

//bodyparser 
const  chatRouter  = require("./route/chatRoute");

//bodyparser middleware
// express@4.16.0 the body-parser middleware is included in express
app.use(express.json());

//routes
app.use("/chats", chatRouter);
//set the express.static middleware
app.use(express.static(__dirname + "/public"));
app.get('/', (req, res) =>{
    return res.sendFile('index.html')
})
const port = process.env.PORT||3000;
// connection to the mongodb 
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });


const socket = io(http);
//create an event listener

//To listen to messages
socket.on('connection', (socket)=>{
console.log('user connected');
    socket.on('disconnect', () =>{
        console.log("user disconnected!")
    })
    // listen chat event
    socket.on('chat-message', async (msg) =>{
        console.log(`message: ${msg}`)
        //broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg  });
        // save msg to db
        try {
            await new Chat({
                message: msg,
                sender: 'Anonymous'
            }).save()
        } catch (error) {
            console.log(error)
        }
    })
});

//wire up the server to listen to our port 500
http.listen(port, ()=>{
console.log('connected to port: '+ port)
});