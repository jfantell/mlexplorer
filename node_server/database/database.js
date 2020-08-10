//Establish database connection
const mongoose = require('mongoose')

// DB1 resolves to the Docker hosted mongodb uri
mongoose.connect('mongodb://DB1/ExperimentDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})