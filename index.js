// Node server which will handle socket io connections
const express = require("express");
const cors = require('cors');
const http = require('http');
const path = require('path')

const socketio = require('socket.io');

const PORT = process.env.PORT || 3500;

app = express();

const server = http.createServer(app);
const io = socketio(server);


const users = [];

cors();
app.use(express.static((path.join(__dirname, "public"))))

app.get('/', (req, res) => {
        res.sendFile('index.html');
    })

io.on('connection', socket =>{
    console.log(`the connected user is ${socket.id}`)
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})


server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})
