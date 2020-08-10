Project = require('../models/project')
Counter = require('../models/counter')
Experiment = require('../models/experiment')

module.exports = {
    async create_new_experiment(user_id, project_name){

        // Lookup ID for project name
        const project = await Project.findOne({ member_id: user_id, name: project_name})
        const project_id = project._id

        //Get autoincrement value to serve as experiment_id
        //not to be confused with the _id for the experiment
        //which will not be directly exposed
        var counter = await Counter.findByIdAndUpdate({_id: project_id }, {$inc: { seq: 1} }, {new: true, upsert: true});

        if(!project_id){
            throw Error("Unable to find project with the provided project name")
        }
        const experiment = new Experiment({
            project_id: project_id,
            experiment_id: counter.seq
        })

        await experiment.save()
        return experiment
    },

    //charts is an array of chart objects
    //a chart object is comprised of one attribute for different datasets
    async add_epoch_data(epoch_data, user_id, project_name, experiment_id){
        if(!epoch_data){
            throw "No epoch data"
        }

        project = await Project.findOne({member_id: user_id, name: project_name})
        
        if (!project) {
            throw "Unable to get specific project"
        }
        
        experiment = await Experiment.findOne({project_id: project._id, experiment_id: experiment_id})

        if (!experiment) {
            throw "Unable to get specific experiment"
        }

        //Traverse epoch object
        //Convert all values to float
        for(var ele in epoch_data){
            if(ele == 'optimizer') {
                experiment[ele].push(epoch_data[ele])
            }
            else{
                experiment[ele].push(parseFloat(epoch_data[ele]))
            }
        }

        await experiment.save()
        return experiment
    },


    async clone_experiment(start_epoch, user_id, project_name, experiment_id){
        const project = await Project.findOne({member_id: user_id, name: project_name})
        
        if (!project) {
            throw "Unable to get specific project"
        }

        const experiment = await Experiment.findOne({project_id: project._id, experiment_id: experiment_id})
        if (!experiment) {
            throw "Unable to get specific experiment"
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
        return new_experiment 
    }
}