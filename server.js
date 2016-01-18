var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config/config'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    port = process.env.PORT || 8080;


//connect to the database
mongoose.connect(config.db);
//morgan - log all requests to the console
app.use(morgan('dev'));

//middleware for body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//handle CORS requests
app.use(function(req,res,next){
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
   next();
});

//set the location for static files
app.use(express.static(__dirname + '/public'));

//API Routes
var apiRoutes = require('./app/routes/app-routes.js')(app,express);

app.use('/auth', apiRoutes);

//send the users to the front end
app.get('*', function(req,res){
   res.sendFile(path.join(__dirname + '/public/app/views/index.html')); 
});


//listen on port
app.listen(port, function(){
   console.log('Listening on port: ' + port + "...."); 
});