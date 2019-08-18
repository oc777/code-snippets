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
          dateCreated: moment(snippetItem.dateCreated).format('YY MM DD HH:mm'),
          dateUpdated: (moment(snippetItem.dateUpdated).isValid()) ? moment(snippetItem.dateUpdated).format('YY MM DD HH:mm') : 'na',
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
    const userId = req.session.user
    const snippet = new SnippetItem({
      title: req.body.title,
      code: req.body.code,
      author: userId
    })

    await snippet.save()

    req.session.flash = { type: 'success', text: 'Snippet was submited successfully.' }
    res.redirect('.')
  } catch (error) {
    next(error)
  }
}

// edit GET
snippetController.edit = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    if (isAuthorized(snippetItem.author, req.session.user)) {
      const locals = {
        id: snippetItem._id,
        dateUpdated: snippetItem.dateUpdated,
        dateCreated: snippetItem.dateCreated,
        title: snippetItem.title,
        code: snippetItem.code,
        author: snippetItem.author
      }

      res.render('snippets/edit', { locals })
    } else {
      // not authorized
      next(errorResponse(403))
    }
  } catch (error) {
    req.session.flash = { type: 'error', text: 'could not open' }
    res.redirect('..')
  }
}

// edit POST
snippetController.editSnippet = async (req, res, next) => {
  try {
    // check if authorized?
    if (isAuthorized(req.body.author, req.session.user)) {
      const snippet = await SnippetItem.updateOne({ _id: req.params.id }, { $set: {
        title: req.body.title,
        code: req.body.code,
        dateUpdated: moment(new Date())
      } })

      if (snippet.nModified === 1) {
        req.session.flash = { type: 'success', text: 'snippet updated successfully' }
      } else {
        req.session.flash = { type: 'error', text: 'could not update' }
      }

      res.redirect('..')
    } else {
      next(errorResponse(403))
    }
  } catch (error) {
    req.session.flash = { type: 'error', text: 'could not update' }
    res.redirect('.')
  }
}

// delete GET
snippetController.delete = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    if (isAuthorized(snippetItem.author, req.session.user)) {
      const locals = {
        id: snippetItem._id,
        title: snippetItem.title,
        code: snippetItem.code,
        author: snippetItem.author
      }

      res.render('snippets/delete', { locals })
    } else {
      next(errorResponse(403))
    }
  } catch (error) {
    req.session.flash = { type: 'error', text: 'could not open' }
    res.redirect('..')
  }
}

// delete POST
snippetController.deleteSnippet = async (req, res, next) => {
  try {
    if (isAuthorized(req.body.author, req.session.user)) {
      await SnippetItem.deleteOne({ _id: req.params.id })
      req.session.flash = { type: 'success', text: 'snippet deleted successfully' }
      res.redirect('..')
    } else {
      next(errorResponse(403))
    }
  } catch (error) {
    req.session.flash = { type: 'error', text: 'could not delete' }
    res.redirect('..')
  }
}

const isAuthorized = (snippetAuthor, sessionUser) => {
  return snippetAuthor.localeCompare(sessionUser) === 0
}

const errorResponse = (errCode) => {
  const err = new Error()
  err.statusCode = errCode
  return err
}

module.exports = snippetController
