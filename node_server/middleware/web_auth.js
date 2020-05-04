const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('../logging/logging')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.WEB_TOKEN_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        logger.error("Error 5001: Auth Error %o", e)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth