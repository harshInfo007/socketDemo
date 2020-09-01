var socket = io();

socket.on('connect', function () {
    console.log('connected to server from client')

const params = new URLSearchParams(window.location.search);
let paramObj = {};
for(var value of params.keys()) {
     paramObj[value] = params.get(value);
 }
    
    console.log(params, paramObj)
    socket.emit('join', paramObj, (err) => {
        if(err) {
            window.alert(err)
            window.location.href = '/'
        }
    })
    socket.emit('createEmail', {
        from: 'abc@email.com',
        to: '12@gmail.com',
        text: 'hi'
    }, (message) => {
        console.log(message);
    })
});

socket.on('updateUserList', function (arrOfUsers) {
    var template = jQuery('#users-template').html();

    var arrOfHtml = arrOfUsers.map(objUser =>  Mustache.render(template,{
        name: objUser,
    }))
    jQuery('#users').html(arrOfHtml);
});

socket.on('newEmail', function (obj) {
    console.log(`newEmail ${JSON.stringify(obj)}`)
});

socket.on('newMessage', function (obj) {
    console.log(`newMessage ${JSON.stringify(obj)}`)
    var template = jQuery('#message-template').html();
    console.log(`${obj.from}: ${obj.text}`)
        var createdAt = moment(obj.createdAt).format('hh:mm a');
        var html = Mustache.render(template,{
            from: obj.from,
            createdAt,
            text: obj.text
        })
        jQuery('#messages').append(html);
        scrollToBottom();
});

socket.on('newLocationMessage', function (obj) {
    console.log(`newMessage ${JSON.stringify(obj)}`)
    var template = jQuery('#location-message-template').html();
    var createdAt = moment(obj.createdAt).format('hh:mm a');
    var html = Mustache.render(template,{
        from: obj.from,
        createdAt,
        url: `https://www.google.com/maps?q=${obj.lat},${obj.long}`
    })
    locBtn.removeAttr('disabled');
    jQuery('#messages').append(html);
    scrollToBottom();
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