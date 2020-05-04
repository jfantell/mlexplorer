const express = require('express')
const Project = require('../models/project')
const User = require('../models/user')
const auth = require('../middleware/web_auth')
const router = new express.Router()
const logger = require('../logging/logging')
const mongoose = require('mongoose')

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
        res.status(201).send(project)
    } catch (e) {
        logger.error("Error 2000: %o", e)
        res.status(404).send(`Error: Unable to create a new project`)
    }
})

// Get all existing projects
// for a given user
router.get('/projects', auth, async (req, res) => {
    try {
        projects = await Project.find({member_id: req.user._id}).populate('member_id','-_id email first_name last_name').populate('owner_id','-_id email first_name last_name').exec()
        if(projects) res.send(projects)
        else res.status(404).send(`Error: ${e}`)
    } catch (e) {
        logger.error("Error 2001: %o", e)
        res.status(404).send(`Error: Unable to get all projects for given user`)
    }
})

// Get a specific project
router.get('/projects/:name', auth, async (req, res) => {
    const name = req.params.name

    try {
        const project = await Project.findOne({ name: name, member_id: req.user._id })

        if (!project) {
            logger.error("Error 2002: Cannot get specific project for given user")
            return res.status(404).send("Cannot get specific project for given user")
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
        res.status(500).send(`Error: Server error`)
    }
})

// Update project attributes
// Can only update description (at the moment)
router.patch('/projects/:name', auth, async (req, res) => {
    const name = req.params.name
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        logger.error("Error 2004: Unable to update project")
        return res.status(404).send("Error: Unable to update project")
    }

    try {
        const project = await Project.findOne({ name: name, owner_id: req.user._id})

        if (!project) {
            logger.error("Error 2005: Unable to update project")
            return res.status(404).send("Error: Unable to update project")
        }
        
        updates.forEach((update) => project[update] = req.body[update])
        await project.save()
        res.send(project)
    } catch (e) {
        logger.error("Error 2006: %o", e)
        res.status(500).send(`Error: Server error`)
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
            return res.status(404).send("Error: Unable to add member to project")
        }

        //Find member given email
        var member = await User.findOne({email : member_email});
        
        //If not a member, we can invite them to signup via email
        if (!member) {
            member = new User({
                email: member_email,
                pending: true
            })
            await member.save({ validateBeforeSave: false }) 
        }

        //Ping them, to sign up
        if(member.pending){
            await member.inviteUserByEmail()
        }

        //Make the update
        if(!project.member_id.includes(member._id)){
            project.member_id.push(member._id)
        }
        await project.save()

        res.send(project)
    } catch (e) {
        logger.error("Error 2009: %o", e)
        res.status(500).send(`Error: Server Error`)
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
            return res.status(404).send("Unable to remove member from project")
        }

        //Find user id given email
        const member = await User.findOne({email : member_email});

        if (!member) {
            logger.error("Error 2011: Unable to remove member from project")
            return res.status(404).send("Unable to remove member from project")
        }

        //Make the update
        if(!member._id.equals(project.owner_id)){
            project.member_id.pull(member._id)
        }

        await project.save()
        res.send(project)
    } catch (e) {
        logger.error("Error 2012: %o", e)
        res.status(500).send(`Error: Server Error`)
    }
})

// Delete project by name
// Only project owner can do this
router.delete('/projects/:name', auth, async (req, res) => {
    const name = req.params.name
    try {
        const project = await Project.findOneAndDelete({ name: name, owner_id: req.user._id })

        if (!project) {
            returnres.status(404).send("Unable to delete project")
        }

        res.send(project)
    } catch (e) {
        logger.error("Error 2013: %o", e)
        res.status(404).send(`Error: Unable to delete project`)
    }
})

module.exports = router