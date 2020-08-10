const express = require('express')
const Project = require('../models/project')
const User = require('../models/user')
const auth = require('../middleware/web_auth')
const router = new express.Router()
const logger = require('../logging/logging')
const UserError = require('../utilities/user_error')

// Create new project
// A project contains zero or more experiments
// Any member that belongs to a project
// can create or delete experiments
router.post('/projects', auth, async (req, res) => {
    const project = new Project({
        ...req.body,
        owner_id:req.user._id,
        member_id:req.user._id
    })

    try {
        await project.save()
        res.status(201).send({msg:"Successfully created new project",name: project.name})
    } catch (e) {
        logger.error("Error 2000: %o", e)
        res.status(404).send({msg:"Unable to create a new project"})
    }
})

// Get all existing projects
// for a given user
router.get('/projects', auth, async (req, res) => {
    try {
        projects = await Project.find({member_id: req.user._id}).populate('member_id','-_id email first_name last_name').populate('owner_id','-_id email first_name last_name').exec()
        if(projects){
            res.send(projects)
        }
        else {
            throw new UserError("Unable to retrieve projects for given user")
        }
    } catch (e) {
        logger.error("Error 2001: %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Get a specific project
router.get('/projects/:name', auth, async (req, res) => {
    const name = req.params.name

    try {
        const project = await Project.findOne({ name: name, member_id: req.user._id })

        if (!project) {
            logger.error("Error 2002: Cannot get specific project for given user")
            throw new UserError("Cannot get specific project for given user")
        }

        const owner_id = project.owner_id;
        await project.populate('member_id','-_id email first_name last_name').populate('owner_id','-_id email first_name last_name').execPopulate()

        admin = {'isAdmin':false}

        //if the user is also the owner of the project
        //they have admin permissions
        if(req.user._id.equals(owner_id)){
            admin['isAdmin'] = true
        }

        res.send([project,admin])
    } catch (e) {
        logger.error("2003: Error %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Update project attributes
// Can only update description (at the moment)
router.patch('/projects/:name', auth, async (req, res) => {
    const name = req.params.name
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    

    try {

        if (!isValidOperation) {
            logger.error("Error 2004: Unable to update project")
            throw new UserError("Unable to update project")
        }

        const project = await Project.findOne({ name: name, owner_id: req.user._id})

        if (!project) {
            logger.error("Error 2005: Unable to update project")
            throw new UserError("Unable to update project")
        }
        
        updates.forEach((update) => project[update] = req.body[update])
        await project.save()
        res.send({msg: "The project settings have been updated"})
    } catch (e) {
        logger.error("Error 2006: %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Add member to project
// Only project owner can do this
router.patch('/projects/member/add/:name', auth, async (req, res) => {
    const name = req.params.name
    const member_email = req.body.member_email

    try {
        //Get project to add member to
        const project = await Project.findOne({ name: name, owner_id: req.user._id })

        if (!project) {
            logger.error("Error 2007: Unable to add member to project")
            throw new UserError({msg: "Unable to add member to project"})
        }

        //Find member given email
        var member = await User.findOne({email : member_email});
        
        //If not a member, we can invite them to signup via email
        if (!member) {
            member = new User({
                email: member_email,
                invite_placeholder_account: true
            })
            await member.save({ validateBeforeSave: false }) 
        }

        //Ping them, to sign up
        //EMAIL FUNCTIONALITY DISABLAED
        // if(member.invite_placeholder_account){
        //     await member.inviteUserByEmail()
        // }

        //Make the update
        if(!project.member_id.includes(member._id)){
            project.member_id.push(member._id)
        }
        await project.save()

        res.send({msg: "Member has been successfully added to the project"})
    } catch (e) {
        logger.error("Error 2009: %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Remove member from project
// Only project owner can do this
router.patch('/projects/member/remove/:name', auth, async (req, res) => {
    const name = req.params.name
    const member_email = req.body.member_email

    try {
        //Get project to remove member from
        const project = await Project.findOne({ name: name, owner_id: req.user._id })

        if (!project) {
            logger.error("Error 2010: Unable to remove member from project")
            throw new UserError("Unable to remove member from project")
        }

        //Find user id given email
        const member = await User.findOne({email : member_email});

        if (!member) {
            logger.error("Error 2011: Unable to remove member from project")
            throw new UserError("Unable to remove member from project")
        }

        //Make the update
        if(!member._id.equals(project.owner_id)){
            if(!project.member_id.includes(member._id)){
                throw new UserError("This user does not belong to the project.")
            }
            project.member_id.pull(member._id)
        }

        await project.save()
        res.send({msg: "Member has been successfully removed from the project"})
    } catch (e) {
        logger.error("Error 2012: %o", e)
        res.status(404).send({msg: e.message})
    }
})

// Delete project by name
// Only project owner can do this
router.delete('/projects/:name', auth, async (req, res) => {
    const name = req.params.name
    try {
        const project = await Project.findOneAndDelete({ name: name, owner_id: req.user._id })

        if (!project) {
            throw new UserError("Unable to delete project")
        }

        res.send({msg: "The project has been deleted"})
    } catch (e) {
        logger.error("Error 2013: %o", e)
        res.status(404).send({msg: e.message})
    }
})

module.exports = router