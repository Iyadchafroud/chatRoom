const express = require('express');
const path = require('path')
const http = require("http")
const socketio=require('socket.io')
const app = express();
const server = http.createServer(app)

const io =socketio(server)
const PORT = 3000;
//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//run when client connects
io.on("connection", socket => {
    //console.log(socket);
    socket.emit("message", "h from server")/////for the single client 
    //broadcast when user connects
    socket.broadcast.emit("message",'a user join '); ///for all the user except the the user who emitthe event
///runs when client disconncets
    socket.on('disconnect', () => {
        io.emit('message', "a usr hes left")
    })
    ///
    socket.on('chatMessage',(msg)=> {
        console.log(msg);
        io.emit('message',msg)
    })
})

server.listen(PORT,()=>console.log("server running on port 3000"))