'use strict'

const User = require('../models/userItem')
const userController = {}

// register GET
userController.register = async (req, res, next) => {
  res.render('user/register')
}

// register POST
userController.registerUser = async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    })
    await user.save()

    req.session.flash = { type: 'success', text: 'Registration successful.' }
    res.redirect('../user/login')
  } catch (error) {
    console.log(error)
    req.session.flash = { type: 'error', text: 'Registration failed' }
    res.redirect('./register')
  }
}

// login user GET
userController.login = async (req, res, next) => {
  res.render('user/login')
}

// login user POST
userController.loginUser = async (req, res, next) => {
  try {
    const userEmail = req.body.email.toLowerCase()
    const candidatePassword = req.body.password

    const user = await User.findOne({ email: userEmail })

    if (!user) {
        console.log('user not found')
        req.session.flash = { type: 'error', text: 'user not found' }
        res.redirect('./login')
    }

    const isAuthenticated = await user.comparePassword(candidatePassword)
    if (isAuthenticated) {
      req.session.user = user._id
      res.redirect('../snippets/')
    } else {
      req.session.flash = { type: 'error', text: 'Login failed' }
      res.redirect('./login')
    }
  } catch (error) {
    console.log(error)
    req.session.flash = { type: 'error', text: 'Login failed' }
    res.redirect('./login')
  }
}

// logout user
userController.logout = async (req, res, next) => {
  try {
    delete req.session.user
    if (!req.session.user) {
      req.session.flash = { type: 'success', text: 'Logout successful.' }
      res.redirect('..')
    }
  } catch (error) {
    next(error)
  }
}

// check if user is authenticated
userController.authenticate = async (req, res, next) => {
  try {
    if (req.session.user) {
      // authenticated
      next()
    } else {
      // not authenticated
      const err = new Error()
      err.statusCode = 401
      next(err)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = userController
