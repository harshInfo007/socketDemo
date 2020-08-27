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


jQuery('#message-form').on('submit', function (e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:"user",
        text: jQuery('[name=message]').val()
    },(obj) => {
        console.log(`${obj.from}: ${obj.text}`)
        var li = jQuery('<li></li>');
        li.text=`${obj.from}: ${obj.text}`
        jQuery('#messages').append(`<li>${obj.from} ${moment(obj.createdAt).format('hh:mm a')}: ${obj.text}</li>`);
    })
    console.log('createmessage')
})

const locBtn = jQuery('#send-location');
locBtn.on('click', function (e){
    e.preventDefault();
    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        locBtn.attr('disabled','disabled').text("Send Location...")
        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('createLocationMessage', {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            }, (message) => {
                locBtn.removeAttr('disabled')
                jQuery('#messages').append(`<li>${message.from} ${moment(message.createdAt).format('hh:mm a')}: We will sync with u at lat-${message.lat}  long-${message.long}<br> <a target="_blank" href="https://www.google.com/maps?q=${message.lat},${message.long}">my location</a></li>`);
            })
        }, function (error) {
            locBtn.removeAttr('disable')
            console.log(error)
            alert('Geolocation is not supported by your browser');
        });
      }
})