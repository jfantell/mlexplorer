const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('../logging/logging')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET)
        const user = await User.findOne({ _id: decoded._id, api_key : token })

        if (!user) {
            throw new Error("Unable to find user")
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        logger.error("Error 5000: Auth Error %o", e)
        res.status(401).send({status: e.message})
    }
}

module.exports = auth