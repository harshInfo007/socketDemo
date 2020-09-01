const path  = require('path');
const http = require('http');
const express = require('express')
const moment = require('moment')
const { isRealString } = require('./utils/validation')
const app = express()
const port = process.env.PORT || 3000
const SocketIO = require('socket.io')
const { Users } = require('./utils/users');
// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const jQuery = require('jquery')(process.window);
const { generateMessage } = require('./utils/message');
const users = new Users()

const publicPath = path.join(__dirname, ".." , "public");

const server = http.createServer(app);
var io = SocketIO(server);

app.use(express.static(publicPath))

// io.on('connection', (socket) => {
//   socket.on('disconnect', () => {
//     console.log('disconnected from server to client')
//   })
//   socket.on('createEmail', (obj, callback) => {
//     console.log(obj)
//     callback(`Got it dear ${obj.from}`)
//   })

//   socket.on('createMessage', (obj,callback) => {
//     console.log(obj)
//     // io.emit('newMessage',obj)
//     socket.broadcast.emit('newMessage',{...obj, createdAt: moment().valueOf()})
//     callback(obj);
//   })

//   socket.on('join', (obj,callback) => {
//     if(!isRealString(obj.name) || !isRealString(obj.room)){
//       callback('name & display name is required property')
//     }
//     callback()
//   })

//   socket.on('createLocationMessage', (obj,callback) => {
//     console.log(obj)
//     // io.emit('newMessage',obj)
//     socket.broadcast.emit('newMessage',{...obj, from: 'Admin', createdAt: moment().valueOf()})
//     callback({...obj, from: 'Admin'});
//   })

//   socket.emit('newMessage', generateMessage('Admin', 'Welcome to my place'));

//   socket.broadcast.emit('newMessage', generateMessage(
//     'Admin',
//     'New user has joined our group please greet him'
//   ));

//   socket.emit('newEmail', {
//     from: 'harsh@gmail.com',
//     to: 'abc@gmail.com',
//     text: 'table'
//   });

//   console.log(`new user connected`)});

io.on('connection', (socket) => {

  socket.on('join', (obj,callback) => {
    if(!isRealString(obj.name) || !isRealString(obj.room)){
      callback('name & display name is required property')
    }
    users.removeUser(socket.id);
    users.addUser(socket.id, obj.name, obj.room);
    console.log('final users', users.getUsersList(obj.room))
    socket.join(obj.room);
    io.in(obj.room).emit('updateUserList', users.getUsersList(obj.room))
    socket.emit('newMessage', generateMessage('Admin', `Welcome to room: ${obj.room}`))
    socket.broadcast.to(obj.room).emit('newMessage', generateMessage('Admin', `${obj.name} has joined our ${obj.room} room`))
    callback()
  })

  socket.on('createLocationMessage', (obj,callback) => {
    console.log(obj)
    // io.emit('newMessage',obj)
    const user = users.getUser(socket.id);
    var newObj = {...obj,from: user.name , createdAt: moment().valueOf()};
    socket.to(user.room).broadcast.emit('newLocationMessage',newObj)
    callback(newObj);
  })

  socket.on('createMessage', (obj,callback) => {
    console.log(obj)
    const user = users.getUser(socket.id);
    console.log(user, obj)
    // io.emit('newMessage',obj)
    var newObj = {text: obj.text,from: user.name , createdAt: moment().valueOf()};
    socket.to(user.room).emit('newMessage',newObj)
    callback(newObj);
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUsersList(user.room))
      io.to(user.room).emit('newMessage', generateMessage(
        'Admin',
        `${user.name} has left the group.`
      ))
    }
  })
});
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })