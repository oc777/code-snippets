'use strict'

const moment = require('moment')
const SnippetItem = require('../models/snippetItem')
const snippetController = {}

// index GET
snippetController.index = async (req, res, next) => {
  try {
    const locals = {
        snippetItems: (await SnippetItem.find({}))
          .map(snippetItem => ({
            id: snippetItem._id,
            date: snippetItem.date,
            title: snippetItem.title,
            code: snippetItem.code,
            author: snippetItem.author
          }))
      }
    res.render('snippets/index', { locals })
  } catch (error) {
    next(error)
  }
}

// create GET
snippetController.create = async (req, res, next) => {
  res.render('snippets/create')
}

// create POST
snippetController.createSnippet = async (req, res, next) => {
  try {
    const snippet = new SnippetItem({
      date: moment(),
      title: req.body.title,
      code: req.body.code,
      author: 'author'
    })

    await snippet.save()

    req.session.flash = { type: 'success', text: 'Snippet was submited successfully.' }
    res.redirect('.')
  } catch (error) {
    console.log(req.body)
    req.session.flash = { type: 'error', text: error.message }
    res.render('snippets/create')
  }
}

module.exports = snippetController
