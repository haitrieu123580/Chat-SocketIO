require('dotenv').config()
const Chat = require('./models/Chat')
const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()
app.use(cookieParser());
//require the http module
const http = require('http').Server(app)
const cors = require('cors')
app.use(cors());
//bodyparser 

const chatRouter = require("./route/chatRoute");
const indexRoute = require('./route/indexRoute');
const authRouter = require('./route/authRoute')
//bodyparser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to the mongodb 
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    })


//set the express.static middleware
app.use(express.static(__dirname + "/public"));


app.set('view engine', 'ejs');

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 24 * 60 * 60 * 1000, 
//         httpOnly: true, 
//         secure: false, 
//     },
// }));
app.get('/',(req, res) => {
    return res.render('login');
});
//routes
app.use("/chats", chatRouter);
app.use("/index", indexRoute);
app.use('/auth',authRouter);
const port = process.env.PORT || 3000;

const io = require('socket.io')(http);


// Create an event listener
let users = [];

io.on('connection', (socket) => {
    console.log('user connected');


    socket.on('disconnect', () => {
        console.log("user disconnected!");
        if (socket.name) {
            users.splice(users.indexOf(socket.name), 1);
            // Emit the updated list of online users to all connected clients
            io.emit('get-users', users); // Change 'socket.emit' to 'io.emit'
        }
    });

    // Listen to the 'chat-message' event
    socket.on('chat-message', async ({ msg, sender }) => {
        console.log(`message: ${msg}`);
        // Broadcast message to everyone in port:5000 except yourself.
        socket.broadcast.emit("received", { message: msg, sender: sender });
        // Save msg to db
        try {
            await new Chat({
                message: msg,
                sender: sender
            }).save();
        } catch (error) {
            console.log(error);
        }
    });

    // Xử lý khi người dùng đăng nhập
    socket.on('logined', (username) => {
        // Gán tên người dùng cho thuộc tính 'name' của socket
        socket.name = username;
        // Thêm người dùng vào danh sách người dùng đang online
        users.push(username);
        // Gửi lại danh sách người dùng đang online mới cho tất cả các kết nối
        io.emit('get-users', users);
    });
});


//wire up the server to listen to our port 500
http.listen(port, () => {
    console.log('connected to port: ' + port)
});