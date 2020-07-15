const express = require('express')
const path = require('path')
const todoRoutes = require('./routes/todo')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use('/api/carts', todoRoutes)


app.use((req, res, next) => {
  res.sendFile('/index.html')
})

function start() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

start()