'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Create user schema.
const userItemSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'email is required',
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'email is invalid'],
        index: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

// Implement password comparing.
userItemSchema.method.comparePassword = (canditatePassword) => {
    return bcrypt.compare(canditatePassword, this.password)
}

// hashing a password before saving it to the database
userItemSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 12, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

// Create a model using the schema.
const UserItem = mongoose.model('user', userItemSchema)

// Exports.
module.exports = UserItem