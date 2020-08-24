var socket = io();

socket.on('connect', function () {
    console.log('connected to server from client')

    socket.emit('createEmail', {
        from: 'abc@email.com',
        to: '12@gmail.com',
        text: 'hi'
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