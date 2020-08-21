const path  = require('path');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, ".." , "public");

app.use(express.static(publicPath))


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })