const mongoose = require('mongoose') 
const Experiment = require('./experiment')
const User = require('./user')

const ProjectSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    name: {
        unique: true,
        type: String,
        trim: true,
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    member_id:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
}, { collection: 'Project' }, { toJSON: { virtuals: true }, toObject: { virtuals: true }})

//Link project with all experiments associated with the project
ProjectSchema.virtual('experiments', {
    ref: 'Experiment',
    localField: '_id',
    foreignField: 'project_id'
})

//Return a project object (as JSON) without the user id
ProjectSchema.methods.toJSON = function () {
    const project = this
    const projectObject = project.toObject()

    return projectObject
}

// //Ensure that that a given user can have no more than one project with
// //the same name
// ProjectSchema.index({ name: 1, owner_id: 1}, { unique: true })

const Project = mongoose.model('Project', ProjectSchema)
module.exports = Project