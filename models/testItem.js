'use strict'

const mongoose = require('mongoose')

// Create a schema.
const testItemSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  snippet: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author: {
    type: String
  }
})

// Create a model using the schema.
const testItem = mongoose.model('testItem', testItemSchema)

// Exports.
module.exports = testItem
