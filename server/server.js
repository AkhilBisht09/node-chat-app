const path=require('path');
const http=require('http');
const publicpath=path.join(__dirname,'../public');
const socketio=require('socket.io');
const express=require('express');
const port=process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}=require('./../public/js/utils/message');
var app=express();
var server=http.createServer(app);
var io=socketio(server);
app.use(express.static(publicpath));
io.on("connection",(socket)=>{
    socket.emit('newMessage',generateMessage('Admin','WELCOME TO CHAT'));
    socket.broadcast.emit('newMessage',generateMessage('Admin',"New User Joined"));
    console.log("Nice User");
    socket.on("createMessage",(message,callback)=>{
        console.log(message);
        io.emit("newMessage",generateMessage(message.from,message.text));
        callback(); 
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected");
    });
    
});

server.listen(port,()=>{
    console.log("app started at port 3000");
});