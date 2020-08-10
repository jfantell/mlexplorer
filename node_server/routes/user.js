const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/web_auth')
const router = new express.Router()
const logger = require('../logging/logging')
const CoreUser = require('../core/user')
const UserError = require('../utilities/user_error')

//Create a new user via main registration portal
//Generates a token and api key
router.post('/users/register', async (req, res) => {
    try {
        await CoreUser.create_new_user(req.body,req.query)
        res.status(201).send({msg: "An account has been created. Please login."})
    } catch (e) {
        logger.error("Error 1000: %o", e)
        if(e == undefined) {
            e = "Sorry, an error occured! Please try again later!"
        }
        else if (e.message == 'User validation failed: email: Path `email` is required.' || e.message == 'User validation failed: email: This email address is invalid'){
            e = "Please enter a valid email."
        }
        else {
            e = e.message
        }
        res.status(400).send({msg: e})
    }
})

//E-MAIL FUNCTIONALITY DISABLED
//Activate user account
// router.get('/users/activate', async (req, res) => {
//     try {
//         await CoreUser.activate(req.query)
//         res.send("This user account has been activated")
//     } catch (e) {
//         logger.error("Error 999: %o", e)
//         res.status(404).send(`Error: Unable to activate user account`)
//     }
// })

// Log a user in
// Generates a token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user.active){
            throw new UserError("User account not active")
        }
        const token = await user.generateAuthToken()

        //get current datetime
        var d = new Date();
        logger.info(`User: ${user.email} logged in`)
        res.send({ user, token })
    } catch (e) {
        logger.error("Error 1001: %o", e)
        if(e == undefined) {
            e = "Sorry, an error occured! Please try again later!"
        }
        else {
            e = e.message
        }
        res.status(400).send({msg: e})
    }
})

// Log a user out
// Deletes current token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
         //get current datetime
         var d = new Date();
         logger.info(`User: ${req.user.email} logged out`)
        res.send({status: "User logged out"})
    } catch (e) {
        logger.error("Error 1002: %o", e)
        res.status(404).send({msg: "Unable to log out user."})
    }
})

// Log a user out on all devices
// Delete all tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        //get current datetime
        var d = new Date();
        logger.info(`User: ${req.user.email} logged out of all devices`)
        res.send({msg: "User logged out on all devices"})
    } catch (e) {
        logger.error("Error 1003: %o", e)
        res.status(404).send({msg: "Unable to log out user on all devices"})
    }
})

// Get user profile
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        logger.error({msg:"Error 1004: %o", e})
        res.status(500).send({msg: "Server Error"})
    }
})

// Update user profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['first_name', 'last_name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    try {
        if (!isValidOperation) {
            logger.error("Error 1005: Invalid update to user profile")
            throw new UserError('Invalid update to user profile')
        }

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send({msg: 'User info successfully updated'})
    } catch (e) {
        logger.error("Error 1006: %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send({msg: 'User successfully deleted'})
    } catch (e) {
        logger.error("Error 1007: %o", e)
        res.status(404).send({msg: "Unable to delete user"})
    }
})

module.exports = router