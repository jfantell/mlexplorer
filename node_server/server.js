var express = require('express');
var http = require('http');
const logger = require('./logging/logging'); //required for logging
var server;
var app = express();
var port = process.env.PORT || 3000;
var staticRoot = __dirname;
require('./database/database')

//Set up routes
const userRouter = require('./routes/user')
const projectRouter = require('./routes/project')
const experimentRouter = require('./routes/experiment')

app.set('port', (port));
app.use(express.static(staticRoot));
app.use(express.json());

app.use(userRouter)
app.use(projectRouter)
app.use(experimentRouter)

server = http.createServer(app).listen(port, function() {
	logger.info("Server listening on port %d", port);
});

app.get('/test',(req,res)=>{
	res.send("I am up")
})