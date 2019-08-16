'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/snippetController')

// view all snippets
router.get('/', controller.index)

// create snippet
router.route('/create')
  .get(controller.create)
  .post(controller.createSnippet)

// edit snippet
router.route('/edit/:id')
  .get(controller.edit)
  .post(controller.editSnippet)

// // delete snippet
// router.get('/delete/:id', controller.delete)
// router.post('/delete', controller.deleteSnippet)

module.exports = router
