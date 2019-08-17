'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/snippetController')
const UserController = require('../controllers/userController')

// view all snippets
router.get('/', controller.index)

// create snippet
router.route('/create')
  .get(UserController.authenticate, controller.create)
  .post(UserController.authenticate, controller.createSnippet)

// edit snippet
router.route('/edit/:id')
  .get(UserController.authenticate, controller.edit)
  .post(UserController.authenticate, controller.editSnippet)

// delete snippet
router.route('/delete/:id')
  .get(UserController.authenticate, controller.delete)
  .post(UserController.authenticate, controller.deleteSnippet)

module.exports = router
