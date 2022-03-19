const express = require('express');
const path = require('path')
const http = require("http")
const socketio=require('socket.io')
const app = express();
const server = http.createServer(app)
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')



const io =socketio(server)
const PORT = 3000;
const botName = 'chat'
//set static folder
app.use(express.static(path.join(__dirname, 'public')))


io.on("connection", socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)
        socket.emit("message", formatMessage(user.username, "welcome"));
        socket.broadcast.to(user.room).emit("message",
            formatMessage(username, `${user.username} has joined the chat`));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    socket.on('disconnect', () => {
        user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} leaved the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        };

    })
})

server.listen(PORT,()=>console.log("server running on port 3000"))