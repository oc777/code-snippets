'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')

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
    maxAge: 1000 * 60 * 60, // 60 minutes
    sameSite: 'lax'
  }
}

app.use(session(sessionOptions))

// use Helmet HTTP headers with default modules enabled
app.use(helmet())

// and Helmet with CSP enabled
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}))

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

// Preserve authentication cookie between requests
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

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.render(path.join(__dirname, 'views', 'errors/404.hbs'))
})

// custom error handling
app.use((err, req, res, next) => {
  // 401 - lacks valid authentication
  if (err.statusCode === 401) {
    console.log('401 err')
    return res.status(401).render(path.join(__dirname, 'views', 'errors/401.hbs'))
  }

  // 403 - not authorized
  if (err.statusCode === 403) {
    console.log('403 err')
    return res.status(403).render(path.join(__dirname, 'views', 'errors/403.hbs'))
  }

  // 404 - not found
  if (err.statusCode === 404) {
    console.log('404 err')
    console.log(err)
    return res.status(404).render(path.join(__dirname, 'views', 'errors/404.hbs'))
  }

  // 500 - server error
  console.log('server err')
  res.status(err.status || 500).render(path.join(__dirname, 'views', 'errors/500.hbs'))
  // res.send(err.message || 'server error')
})

// Start listening.
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
