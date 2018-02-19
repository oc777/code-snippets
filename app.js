'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

console.log('Hello world. This is me')

// Configure rendering engine, with change extension to .hbs
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}))

// Setup view engine.
app.set('view engine', 'hbs')

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello', (req, res) => {
  res.render('hello')
})

// Start listening.
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
