var socket = io();
// var moment = require('./libs/moment')

socket.on('connect', function () {
    console.log('connected to server from client')

    socket.emit('createEmail', {
        from: 'abc@email.com',
        to: '12@gmail.com',
        text: 'hi'
    }, (message) => {
        console.log(message);
    })
});

socket.on('newEmail', function (obj) {
    console.log(`newEmail ${JSON.stringify(obj)}`)
});

socket.on('newMessage', function (obj) {
    console.log(`newMessage ${JSON.stringify(obj)}`)
});

socket.on('disconnect',function () {
    console.log('disconnected to server from client')
});

function scrollToBottom() {
    var message = jQuery('#messages');
    var newMessage = message.children('li:last-child');
    //heights
    var clientHeight = message.prop('clientHeight');
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight  + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        message.scrollTop(scrollHeight);
    }
}


jQuery('#message-form').on('submit', function (e){
    e.preventDefault();
    
    var template = jQuery('#message-template').html();
    
    socket.emit('createMessage',{
        from:"user",
        text: jQuery('[name=message]').val()
    },(obj) => {
        console.log(`${obj.from}: ${obj.text}`)
        var createdAt = moment(obj.createdAt).format('hh:mm a');
        var html = Mustache.render(template,{
            from: obj.from,
            createdAt,
            text: obj.text
        })
        jQuery('#messages').append(html);
        scrollToBottom();
    })
    console.log('createmessage')
})

const locBtn = jQuery('#send-location');
locBtn.on('click', function (e){
    e.preventDefault();
    var template = jQuery('#location-message-template').html();
    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        locBtn.attr('disabled','disabled').text("Send Location...")
        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            }, (message) => {
                var createdAt = moment(message.createdAt).format('hh:mm a');
                var html = Mustache.render(template,{
                    from: message.from,
                    createdAt,
                    url: `https://www.google.com/maps?q=${message.lat},${message.long}`
                })
                locBtn.removeAttr('disabled');
                jQuery('#messages').append(html);
                scrollToBottom();
            })
        }, function (error) {
            locBtn.removeAttr('disable')
            console.log(error)
            alert('Geolocation is not supported by your browser');
        });
      }
})