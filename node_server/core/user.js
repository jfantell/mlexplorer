// Takes as input a user object with the following parameters
/***
 * Cases:
 * 
 * 1. first_name, last_name, email, password, confirm_password - Creating user accont from website
 * 2. - Cr
 */
User = require('../models/user')
logger = require('../logging/logging')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const UserError = require('../utilities/user_error')

module.exports = {

    async create_new_user(userObj,query){
        //If a query exists, lets check if it has an invite token
        //which contains the email of the user invited to a certain
        //project
        if(query.token){
            //Try to decode
            try {
                const decoded = jwt.verify(query.token, process.env.INVITE_TOKEN_SECRET)
                userObj['email'] = decoded.email
            } catch (error) {
                logger.info("Unable to decode token %o", error)
            }
        }

        //Ensure userObj has all required attributes
        //for creating a new user
        required_attributes = ['first_name', 'last_name', 'email', 'password', 'confirm_password']
        required_attributes.forEach((attribute) => {
            if(userObj[attribute] == '') {
                throw new UserError("Missing required account details")
            } 
        })

        //Ensure passwords match
        if(userObj.password != userObj.confirm_password){
            throw UserError("Passwords do not match")
        }

        //Determine if user already exists in db
        user = await User.findOne({email : userObj.email})
        if(user){ //if user found, check if account is pending (this means a placeholder account was created via an invite but not setup)
            if(user.pending){
                user.first_name = userObj.first_name
                user.last_name = userObj.last_name
                user.password = userObj.password
                user.pending = false
            }
            else{ //an account already exists for this user
                throw UserError("Unable to create user account. User with this email already exists.")
            }
        }else{
             user = new User({
                first_name : userObj.first_name,
                last_name : userObj.last_name,
                email: userObj.email,
                password: userObj.password,
            })
        }
        await user.save()
        await user.generateAPIKey()
        await user.sendValidation()
    },

    async activate(query){
        const token = query.token
        const decoded = jwt.verify(token, process.env.VALIDATE_TOKEN_SECRET)
        const user_id = decoded._id
        const user = await User.findOne({_id: user_id})
        user.active = true
        await user.save()
    }
};