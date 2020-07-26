const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Project = require('./project')
const transporter = require('../mail/mail')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('This email address is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Your password cannot contain "password"')
            }
            if (value.length < 10){
                throw new Error('Your password needs to be at least 10 characters long')
            }
        }
    },
    active:{
        type: Boolean,
        default: false
    },
    invite_placeholder_account : {
        type: Boolean,
        default: false
    },
    api_key: {
        type: String,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { collection: 'User' }, { toJSON: { virtuals: true }, toObject: { virtuals: true }})

//Link user with all projects created by the user
UserSchema.virtual('projects', {
    ref: 'Project',
    localField: '_id',
    foreignField: 'member_id'
})

//Return a user object (as JSON) without the password or token
UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    // delete userObject.password
    // delete userObject.tokens
    // delete userObject.__v
    // delete userObject._id

    return userObject
}

//Create auth token required to view and compare experiments
UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.WEB_TOKEN_SECRET, { expiresIn: '1 day' })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//Create api key
UserSchema.methods.generateAPIKey = async function () {
    const user = this
    const api_key = jwt.sign({ _id: user._id.toString() }, process.env.API_TOKEN_SECRET)

    user.api_key = api_key
    await user.save()

    return api_key
}

//Send validation email
UserSchema.methods.sendValidation = async function() {
    user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.VALIDATE_TOKEN_SECRET,{ expiresIn: '1 day' })

    url = `http://127.0.0.1:7000/api/users/activate?token=${token}`
    
    transporter.sendMail({
        from: '"Dolphin Data LLC" <admin@dolphindatallc.com>', // sender address
        to: `${user.email}`, // list of receivers
        subject: "Activate Your ML Explorer Account", // Subject line
        html: `
        ML Explorer is a collaborative open-source meta machine learning tool.
        To activate your ML Explorer account click on the following link: <a href="${url}">Activate Account!</a>` // html body)
    })
}

//Invite a user to ML Explorer
UserSchema.methods.inviteUserByEmail = async function(){
    user = this
    const token = jwt.sign({ email : user.email }, process.env.INVITE_TOKEN_SECRET, { expiresIn: '1 day' })

    url = `http://127.0.0.1:7000/register?token=${token}`

    transporter.sendMail({
        from: '"Dolphin Data LLC" <admin@dolphindatallc.com>', // sender address
        to: `${user.email}`, // list of receivers
        subject: "You were added to a project on ML Explorer!", // Subject line
        html: `
        ML Explorer is a collaborative open-source meta machine learning tool. In order to join
        the project (to which you have been invited) you must create an account.

        Please open the following link to complete your account sign up : <a href="${url}">Sign Up!</a>
        ` // html body)
    })
}

//Attempt to authenticate
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash plain text password, then save to database
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
UserSchema.pre('remove', async function (next) {
    const user = this
    await Project.deleteMany({ user_id: user._id })
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User