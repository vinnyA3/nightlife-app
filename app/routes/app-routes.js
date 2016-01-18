//require what we need ...
var User = require('../models/users'),
    config = require('../../config/config'),
    jwt = require('jsonwebtoken');

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
        
        newUser.save(function(err){
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
            var token = jwt.sign({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password
            }, config.secret, {expiresIn: 1440});
            
            res.json({token: token});
            
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
                        var token = jwt.sign({
                           email: user.email,
                           password: user.password
                        }, config.secret, {expiresIn: 1440});
                        req.body.token = token;
                        res.json({token:token});
                    }//end else
                    
                }
        });
    });
    
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
    //route middleware to verify a token
    /*router.use(function(req,res,next){
       //check the header/urlparams/postparams for a token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        //decode the token
        if(token){
            //verify the secret and checks the exp
            jwt.verify(token, config.secret, function(err,decoded){
               if(err){
                   return res.status(403).send({success:false, message: 'Failed to authenticate token!'});
               }
                  //if everything is okay, save to the request for use in the other routes
                  req.decoded = decoded;
                  //break out of middleware limbo
                  next();
            });
            
        }else{
            //if there is no token, return an http status of 403(forbidden) and an error message as well
            return res.status(403).send({success:false, message:'No token provided!'});
        }
        
    });*/

    // API ROUTES -- for this app, the only authenticated routes are going to be for user profile and mutiple actions on the page
    router.get('/dashboard', function(req,res){
        //with a validated token, we have a decoded property containing the user
        console.log(req.headers);
        console.log(req.headers.authorization);
        return;
    });
    
    return router;
    
    
};//end module exports