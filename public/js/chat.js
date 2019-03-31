var socket=io();

function scrollToBottom(){
var messages=$('#messages');
var newmessage=messages.children('li:last-child');
var clientHeight=messages.prop('clientHeight');
var scrollHeight=messages.prop('scrollHeight');
var scrollTop=messages.prop('scrollTop');
if(scrollTop+clientHeight<=scrollHeight){
    messages.scrollTop(scrollHeight);
}
};
socket.on("connect",function (){
var param=jQuery.deparam(window.location.search);
socket.emit('join',param,function (err){
    if(err){
alert(err);
window.location.href='/';
    }
    else{
console.log('No error');
    }
});
});
socket.on("disconnect",function (){
    console.log("Server gone");
});
socket.on('updateUserList',function (users){
var ol=jQuery('<ol></ol>');
users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
});
jQuery('#users').html(ol);
});

socket.on("newMessage",function(message){
    var formattedTime=moment(message.createdAt).format('h:mm a');
    var template=$('#message-template').html();
    var html=Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });
    $('#messages').append(html);
   scrollToBottom();
    
});
document.getElementById("myBtn").addEventListener("click", function myFunction(e){
    e.preventDefault();
    var messageTextbox=$('[name=message]');
    socket.emit("createMessage",{
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
    var template=$('#location-message-template').html();
    var html=Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});
