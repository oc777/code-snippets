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
    const snippet = new SnippetItem({
      // date: new Date(),
      title: req.body.title,
      code: req.body.code,
      author: 'author'
    })

    await snippet.save()

    req.session.flash = { type: 'success', text: 'Snippet was submited successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'error', text: error.message }
    res.render('..')
  }
}

// edit GET
snippetController.edit = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      dateUpdated: snippetItem.dateUpdated,
      dateCreated: snippetItem.dateCreated,
      title: snippetItem.title,
      code: snippetItem.code,
      author: snippetItem.author
    }

    res.render('snippets/edit', { locals })
  } catch (error) {
    req.session.flash = { type: 'error', text: error }
    res.redirect('..')
  }
}

// edit POST
snippetController.editSnippet = async (req, res, next) => {
  try {
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
  } catch (error) {
    req.session.flash = { type: 'error', text: error }
    res.redirect('.')
  }
}

// delete GET
snippetController.delete = async (req, res, next) => {
  try {
    const snippetItem = await SnippetItem.findOne({ _id: req.params.id })
    const locals = {
      id: snippetItem._id,
      title: snippetItem.title,
      code: snippetItem.code,
      author: snippetItem.author
    }

    res.render('snippets/delete', { locals })
  } catch (error) {
    req.session.flash = { type: 'error', text: error }
    res.redirect('..')
  }
}

// delete POST
snippetController.deleteSnippet = async (req, res, next) => {
  try {
    await SnippetItem.deleteOne({ _id: req.params.id })
    req.session.flash = { type: 'success', text: 'snippet deleted successfully' }
    res.redirect('..')
  } catch (error) {
    req.session.flash = { type: 'error', text: JSON.stringify(error) }
    res.redirect('..')
  }
}

module.exports = snippetController
