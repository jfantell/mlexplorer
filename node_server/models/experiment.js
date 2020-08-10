const mongoose = require('mongoose')

const ExperimentSchema = new mongoose.Schema({
    experiment_id:{
        required: true,
        type: Number,
        unique: true
    },
    metadata:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    hyperparameters:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    parent : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experiment'
    },
    children : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experiment'
    }],
    test_loss : {
        type: Number,
        default: 0.0
    },
    test_accuracy : {
        type: Number,
        default: 0.0
    },
    val_loss :[{
        type: Number
    }],
    val_accuracy :[{
        type: Number
    }],
    loss :[{
        type: Number
    }],
    accuracy:[{
        type: Number
    }],
    optimizer:[{
        type: String
    }],
    learning_rate:[{
        type: Number
    }]
}, 
{ collection: 'Experiment' })

//Return an experiment object (as JSON) without the user id
ExperimentSchema.methods.toJSON = function() {
    const experiment = this
    const experimentObject = experiment.toObject()

    if(process.env.PROD_MODE == 'True'){
        delete experimentObject._id
        delete experimentObject.project_id
        delete experimentObject.__v
    }
    
    // //Create new fields for the very last 
    // // metrics in each experiment
    const epochs = experiment.loss.length
    experimentObject.final_train_loss = (epochs > 0) ? experiment.loss[epochs-1] : 0.0
    experimentObject.final_val_loss = (epochs > 0) ? experiment.val_loss[epochs-1] : 0.0
    experimentObject.final_train_accuracy = (epochs > 0) ? experiment.accuracy[epochs-1] : 0.0
    experimentObject.final_val_accuracy = (epochs > 0) ? experiment.val_accuracy[epochs-1] : 0.0
    experimentObject.epochs = epochs

    return experimentObject
}

ExperimentSchema.index({ project_id: 1, experiment_id: 1}, { unique: true })

const Experiment = mongoose.model('Experiment', ExperimentSchema)
module.exports = Experiment