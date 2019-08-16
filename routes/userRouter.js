'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/userController')

// register user
router.route('/register')
  .get(controller.register)
  .post(controller.registerUser)

// login user
router.route('/login')
//   .get(controller.login)
//   .post(controller.loginUser)

// logout user


module.exports = router
