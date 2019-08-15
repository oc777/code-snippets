'use strict'

const mongoose = require('mongoose')

// Create a schema.
const snippetItemSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: String,
  code: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author: String,
  tags: [String]
})

// Create a model using the schema.
const snippetItem = mongoose.model('snippetItem', snippetItemSchema)

// Exports.
module.exports = snippetItem
