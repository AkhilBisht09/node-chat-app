const path=require('path');
const http=require('http');
const publicpath=path.join(__dirname,'../public');
const socketio=require('socket.io');
const express=require('express');
const port=process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}=require('./../public/js/utils/message');
const {isRealString}=require('./../public/js/utils/validation');
const {Users}=require('./../public/js/utils/users');

var app=express();
var server=http.createServer(app);
var io=socketio(server);
var users=new Users();

app.use(express.static(publicpath));
io.on("connection",(socket)=>{
    socket.on('join',(param,callback)=>{
        if(!isRealString(param.name) || !isRealString(param.room)){
           return callback('Name and room are required');
        }
        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,param.name,param.room);

        io.to(param.room).emit('updateUserList',users.getUserList(param.room));
        socket.emit('newMessage',generateMessage('Admin','WELCOME TO CHAT'));
        socket.broadcast.to(param.room).emit('newMessage',generateMessage('Admin',`${param.name} Joined the room`));
        callback();

    });
    console.log("Nice User");
    socket.on("createMessage",(message,callback)=>{
        var user=users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit("newMessage",generateMessage(user.name,message.text));
        }
        callback(); 
    });
    socket.on('createLocationMessage',(coords)=>{
        var user=users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
      }  });

    socket.on("disconnect",()=>{
        console.log("User disconnected");
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} left the room`));
        }
    });
    
});

server.listen(port,()=>{
    console.log("app started at port 3000");
});