'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

// setup session
const sessionOptions = {
  name: 'snippetsapp',
  secret: 'humptydumpty',
  resave: false,
  saveUninitialized: false, // false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie
  cookie: {
    httpOnly: true,
    // secure: true, // for HTTPS connection
    maxAge: 1000 * 60 * 10 // 10 minutes
  }
}

app.use(session(sessionOptions))

// Configure rendering engine, with change extension to .hbs
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'main'),
  partialsLayout: path.join(__dirname, 'views', 'partials')
}))

// Setup view engine.
app.set('view engine', 'hbs')

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }))

// set up mongoose
mongoose.connect('mongodb://mongo/test')
  .then(() => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.log('Error connecting to database: ' + error)
  })

// Setup flash messages.
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// checks if user is authenticated
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }
  next()
})

// routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippets', require('./routes/snippetRouter'))
app.use('/user', require('./routes/userRouter'))

// 404 handling
app.use((req, res, next) => {
  res.status(404)
  res.render('errors/404')
})

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'server error')
})

// Start listening.
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
