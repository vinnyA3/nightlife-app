//require what we need ...
var User = require('../models/users'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    moment =  require('moment');
    //jwt = require('jsonwebtoken');

module.exports = function(app,express){
    
    var router = express.Router();
    
    //login and signup routes
    //authRoutes.post('/login', function(req,res){});
    router.post('/signup', function(req,res){
        //create a new user
        var newUser = new User();
        //set the user's info with the posted data
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = newUser.generateHash(req.body.password);
        
        newUser.save(function(err,result){
            if(err){
                //we have a duplicate entry
                if(err.code == 11000){
                    return res.send({success: false, message: 'A user with that email already exists!'})
                }else{
                    //return the error
                    return res.send(err);
                }
            }
            //we want to create a token here for client use
            res.json({token: createToken(result)});
            
        });//end save
    });
    
    //authenticate route
    router.post('/login', function(req,res){
        User.findOne({'email': req.body.email})
            .select('email password').exec(function(err,user){
        
                if(err){ throw err;}
                //no user found with the email
                if(!user){
                    res.json({success:false, message: 'No user was found with that email!'});
                }else if(user){
                    //check if we have a valid password
                    var validPass = user.comparePassword(req.body.password);
                    //if the password is invalid
                    if(!validPass){
                        res.json({success:false, message: 'Incorrect Password!'});
                    }else{
                        //if the password checks out, create a token and send that back
                        res.send({token: createToken(user)});
                    }//end else
                    
                }
        });
    });
    
    //create the token
    function createToken(user){
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix,  
        }
        return jwt.encode(payload,config.secret);
    };
    
    //auth middleware - authenticate and check if we have a valid token in the headers
    function ensureAuthenticated(req, res, next) {
          if (!req.headers.authorization) {
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
          }
          var token = req.headers.authorization.split(' ')[1];

          var payload = null;
          try {
            payload = jwt.decode(token, config.secret);
          }
          catch (err) {
            return res.status(401).send({ message: err.message });
          }

          if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired' });
          }
          req.user = payload.sub;
          next();
    }

    // API ROUTES -- for this app, the only authenticated routes are going to be for user profile and mutiple actions on the dash page
    router.get('/dashboard', ensureAuthenticated, function(req,res){
        //once the middleware is successfully passed, we need to find a user based on the ID sent in the request
        User.findOne({'_id': req.user}, function(err,user){
           if(err){return res.send(err);}
            //send the user's information :)
             return res.send(user);
        });
    });
	
	
	//authenticated bar routes
    
    return router;
    
    
};//end module exports