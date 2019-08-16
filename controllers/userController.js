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

        req.session.flash = {type: 'success', text: 'Registration successful.'}
        res.redirect('../snippets/')
    } catch (error) {
        console.log(error)
        req.session.flash = { type: 'error', text: 'Registration failed' }
        res.redirect('./register')
    }
}




// login user
// router.route('/login')
//   .get(controller.login)
//   .post(controller.loginUser)

// logout user




module.exports = userController
