// Takes as input a user object with the following parameters
/***
 * Cases:
 * 
 * 1. first_name, last_name, email, password, confirm_password - Creating user accont from website
 * 2. - Cr
 */
var User = require('../models/user')
const logger = require('../logging/logging')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const UserError = require('../utilities/user_error')
const transporter = require('../mail/mail')

module.exports = {

    async create_new_user(body,query){
        // EMAIL FUNCTIONALITY DISABLED
        //If a query exists, lets check if it has an invite token
        //which contains the email of the user invited to a certain
        //project
        // if(query.token){
        //     //Try to decode
        //     try {
        //         const decoded = jwt.verify(query.token, process.env.INVITE_TOKEN_SECRET)
        //         body['email'] = decoded.email
        //     } catch (error) {
        //         logger.info("Unable to decode token %o", error)
        //     }
        // }
        
        //Ensure body has all required attributes
        //for creating a new user
        required_attributes = ['first_name', 'last_name', 'email', 'password', 'confirm_password']
        required_attributes.forEach((attribute) => {
            if(body[attribute] == '') {
                throw new UserError("Missing required account details")
            } 
        })

        //Ensure passwords match
        if(body.password != body.confirm_password){
            throw new UserError("Passwords do not match")
        }

        //Determine if user already exists in db
        user = await User.findOne({email : body.email})
        if(user){ //if user found, check if account is a placeholder account created by an email invite
            if(user.invite_placeholder_account){
                user.first_name = body.first_name
                user.last_name = body.last_name
                user.password = body.password
                user.invite_placeholder_account = false
            }
            else{ //an account already exists for this user
                throw Error("Unable to create user account. User with this email already exists.")
            }
        } else{
             user = new User({
                first_name : body.first_name,
                last_name : body.last_name,
                email: body.email,
                password: body.password,
            })
        }

        // adds user to database
        await user.save()
        //generates an API key for the user
        await user.generateAPIKey()

        // EMAIL FUNCTIONALITY DISABLED
        // //sends a validation email to the user
        // await user.sendValidation()
    },

    // EMAIL FUNCTIONALITY DISABLED
    // Activate a user account using the token embedded in the url
    // that was sent to the user in an email
    // async activate(query){
    //     const token = query.token
    //     const decoded = jwt.verify(token, process.env.VALIDATE_TOKEN_SECRET)
    //     const user_id = decoded._id
    //     const user = await User.findOne({_id: user_id})
    //     user.active = true
    //     await user.save()
    // }
};