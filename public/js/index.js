var socket=io();
socket.on("connect",function (){
console.log("HI I am client");
});
socket.on("disconnect",function (){
    console.log("Server gone");
});
socket.on("newMessage",function(message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
    console.log("new meassage",message);
    var li=$("<li></li>").text(`${message.from} ${formattedTime}:${message.text}`);
    li.appendTo('#messages');
});
document.getElementById("myBtn").addEventListener("click", function myFunction(e){
    e.preventDefault();
    var messageTextbox=$('[name=message]');
    socket.emit("createMessage",{
        "from":"Bisht09@gmail.com",
        "text":messageTextbox.val()
        },function (data){
            messageTextbox.val("");
        });
       
});
var locationButton=document.getElementById('sendLocation');
locationButton.addEventListener('click',function(e){
    e.preventDefault();
    if (!navigator.geolocation) {
       console.log("geolocation not supported");
    }
    $('#sendLocation').prop('disabled',true).text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        $('#sendLocation').prop('disabled',false).text('Send Location');
        socket.emit('createLocationMessage',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
        });
    },function(){
        $('#sendLocation').prop('disabled',false).text('Send Location');
        alert("Unable to Fetch Location")});
});

socket.on("newLocationMessage",function (message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
    var a=$('<a target="_blanck">My current location</a>').attr('href',message.url);
    var li=$("<li></li>").text(`${message.from} ${formattedTime}: `).append(a);
    li.appendTo('#messages');
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