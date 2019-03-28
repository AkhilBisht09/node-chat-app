const path=require('path');
const http=require('http');
const publicpath=path.join(__dirname,'../public');
const socketio=require('socket.io');
const express=require('express');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketio(server);
app.use(express.static(publicpath));
io.on("connection",(socket)=>{
    console.log("Nice User");
    socket.on("disconnect",()=>{
        console.log("User disconnected");
    });
});

server.listen(port,()=>{
    console.log("app started at port 3000");
});