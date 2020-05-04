//Establish database connection
const mongoose = require('mongoose')

mongoose.connect('mongodb://DB1/ExperimentDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})