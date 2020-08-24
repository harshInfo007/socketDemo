const path  = require('path');
const http = require('http');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const SocketIO = require('socket.io')

const publicPath = path.join(__dirname, ".." , "public");

const server = http.createServer(app);
var io = SocketIO(server);

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('disconnected from server to client')
})
  console.log(`new user connected`)});
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })