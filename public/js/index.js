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


// $('button').click(function(er){
//   er.preventDefault();
// socket.emit("createMessage",{
//     "from":"Bisht09@gmail.com",
//     "text":$('[name=message]').val()
//     },function (data){
//         console.log("Got it",data);
//     });
// });