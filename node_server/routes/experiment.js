const express = require('express')
const Experiment = require('../models/experiment')
const Project = require('../models/project')
const Counter = require('../models/counter')
const web_auth = require('../middleware/web_auth')
const api_auth = require('../middleware/api_auth')
const mongoose = require('mongoose')
const router = new express.Router()
const logger = require('../logging/logging')
const CoreExperiment = require('../core/experiment')

// Create new experiment
// return experiment_id
router.post('/experiments/api', api_auth, async (req, res) => {
    try{
        experiment = await CoreExperiment.create_new_experiment(req.user._id,req.body.project_name)
        res.status(201).send(experiment)
    } catch (e) {
        logger.error("Error 3000: %o", e)
        res.status(404).send(`Error: Unable to create experiment`)
    }
})

// Get all experiments for given user and project name
router.get('/experiments/project/:project_name', web_auth, async (req, res) => {
    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        Experiment.find({project_id: project._id}).populate('parent','-_id experiment_id').populate('children','-_id experiment_id').exec(function (err, experiments) {
            if(experiments) res.send(experiments)
            else res.status(404).send(`Error: Unable to retrieve experiments for given project`)
        })
    } catch (e) {
        logger.error("Error 3001: %o", e)
        res.status(404).send(`Error: Unable to retrieve experiments for given project`)
    }
})

// Get specific experiment
router.get('/experiments/project/:project_name/id/:experiment_id', web_auth, async (req, res) => {

    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        experiment = await Experiment.findOne({project_id: project._id, experiment_id: req.params.experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to get specific experiment")
        }

        //Populate experiments
        await experiment.populate('parent','-_id experiment_id').populate('children','-_id experiment_id').execPopulate()
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3002: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

// Add metadata to experiment
router.patch('/experiments/project/:project_name/id/:experiment_id/meta', api_auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        experiment = await Experiment.findOne({project_id: project._id, experiment_id: req.params.experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to update experiment")
        }

        updates.forEach((update) => experiment.metadata[update] = req.body[update])
        experiment.markModified('metadata');
        await experiment.save()
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3003: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

// Add hyperparams to experiment
router.patch('/experiments/project/:project_name/id/:experiment_id/hyper', api_auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        experiment = await Experiment.findOne({project_id: project._id, experiment_id: req.params.experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to update experiment")
        }

        updates.forEach((update) => experiment.hyperparameters[update] = req.body[update])
        experiment.markModified('hyperparameters');
        await experiment.save()
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3004: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

// Add epoch data to experiment
router.patch('/experiments/project/:project_name/id/:experiment_id/epoch', api_auth, async (req, res) => {
    
    try {
        experiment = await CoreExperiment.add_epoch_data(req.body,req.user._id,req.params.project_name,req.params.experiment_id)
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3005: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

// Add evalution data to experiment
router.patch('/experiments/project/:project_name/id/:experiment_id/eval', api_auth, async (req, res) => {
    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        experiment = await Experiment.findOne({project_id: project._id, experiment_id: req.params.experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to update experiment")
        }

        experiment.test_loss = req.body.test_loss
        experiment.test_accuracy = req.body.test_accuracy

        await experiment.save()
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3006: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

//Delete experiment
router.delete('/experiments/project/:project_name/id/:experiment_id', web_auth, async (req, res) => {
    try {
        project = await Project.findOne({member_id: req.user._id, name: req.params.project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        experiment = await Experiment.findOneAndDelete({project_id: project._id, experiment_id: req.params.experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to delete experiment")
        }
        
        res.send(experiment)
    } catch (e) {
        logger.error("Error 3007: %o", e)
        res.status(500).send(`Error: ${e}`)
    }
})

//Clone and update experiment
router.post('/experiments/clone', api_auth, async (req, res) => {
    try {

        const project_name = req.body.project_name
        const experiment_id = req.body.experiment_id
        const start_epoch = req.body.start_epoch

        const project = await Project.findOne({member_id: req.user._id, name: project_name})
        
        if (!project) {
            return res.status(404).send("Unable to get specific project")
        }
        
        const experiment = await Experiment.findOne({project_id: project._id, experiment_id: experiment_id})

        if (!experiment) {
            return res.status(404).send("Unable to get specific experiment")
        }

        //Create new experiment (exact copy of old experiment)
        const new_experiment = new Experiment({
            ...experiment.toObject()
        })

        // Remove epoch data after provided start_epoch
        if(start_epoch){
            new_experientObject = experiment.toObject()
            for(ele in new_experientObject){
                if((Array.isArray(new_experiment[ele])) && (ele != "children")){
                    new_experiment[ele] = new_experiment[ele].slice(0,start_epoch)
                }
            }
        }

        //Create new experiment_id (public facing id)
        var counter = await Counter.findByIdAndUpdate({_id: experiment.project_id }, {$inc: { seq: 1} }, {new: true, upsert: true});
        new_experiment.experiment_id = counter.seq;

        //Create new _id (default Experiment collections index)
        new_experiment._id = mongoose.Types.ObjectId();

        //Add parent _id to new_experiment
        new_experiment.parent = experiment._id
        
        //Add children _id to experiment
        experiment.children.push(new_experiment._id)

        // Save experiments
        await new_experiment.save()
        await experiment.save()
        
        // Return experiment
        res.send(new_experiment)
    } catch (e) {
        console.log(e)
        res.status(500).send(`Error: ${e}`)
    }
})

module.exports = router