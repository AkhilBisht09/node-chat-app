var socket=io();
socket.on("connect",function (){
console.log("HI I am client");
});
socket.on("disconnect",function (){
    console.log("Server gone");
});
socket.on("newMessage",function(message){
    console.log("new meassage",message);
    var li=$("<li></li>").text(`${message.from}:${message.text}`);
    li.appendTo('#messages');
});
document.getElementById("myBtn").addEventListener("click", function myFunction(e){
    e.preventDefault();
    socket.emit("createMessage",{
        "from":"Bisht09@gmail.com",
        "text":$('[name=message]').val()
        },function (data){
            console.log("Got it",data);
        });
       
});
var locationButton=document.getElementById('sendLocation').addEventListener('click',function(e){
    e.preventDefault();
    if (!navigator.geolocation) {
       console.log("geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
        });
    },function(){
        alert("Unable to Fetch Location")});
});

socket.on("newLocationMessage",function (message){
    var a=$('<a target="_blanck">My current location</a>').attr('href',message.url);
    var li=$("<li></li>").text(`${message.from}: `).append(a);
    li.appendTo('#messages');
})
// $('button').click(function(er){
//   er.preventDefault();
// socket.emit("createMessage",{
//     "from":"Bisht09@gmail.com",
//     "text":$('[name=message]').val()
//     },function (data){
//         console.log("Got it",data);
//     });
// });