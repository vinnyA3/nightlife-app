var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    port = process.env.PORT || 8080;

//morgan - log all requests to the console
app.use(morgan('dev'));

//middleware for body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//handle CORS requests
app.use(function(req,res,next){
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
   next();
});

//set the location for static files
app.use(express.static(__dirname + '/public'));

//catch all route
//send the users to the front end
app.get('*', function(req,res){
   res.sendFile(path.join(__dirname + '/public/app/views/index.html')); 
});

//listen on port
app.listen(port, function(){
   console.log('Listening on port: ' + port + "...."); 
});