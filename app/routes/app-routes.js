//require what we need ...
var User = require('../models/users'),
	Bar = require('../models/barModel'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
	request = require('request'),
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
	
	/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
 router.post('/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.secret);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createToken(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createToken(user);
            res.send({ token: token });
          });
        });
      }
    });
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
	
	
	//post to bars - add bar
	router.post('/bars', ensureAuthenticated, function(req,res){
		//first lets check that the passed location matches an enry in the db
			Bar.findOneAndUpdate({location: req.body.location}, {$push: {'bars':{name:req.body.barname, attending: 1}}}, {upsert:true,new:true}, function(err,bar){
			if(err){
				//if we found a duplicate entry, we want to push the request bar's name and attending into the found entry's bar array in db
				if(err.code == 11000){
					return res.send({success: false, message: 'bar with that name already exists'});
				}else{
					return res.send(err);
				}
			}
			return res.send({success: true, bar:bar});		
		}); //end bar find one
		
		
	})
	// ********** THIS ROUTE IS NOT AUTHENTICATED ************************
		.get('/bars/:location', function(req,res){
			Bar.findOne({location: req.params.location}, function(err,bars){
				if(err){return res.send(err);}
				
				//return the bars based on location
				return res.send(bars);
			});
		})
		.put('/bars/:barname', ensureAuthenticated, function(req,res){
			var name = req.params.barname;
			var location = req.body.location;
			//var determinant to check if we want to increase the attending field, or decrease the attending field
			var determinant = req.body.determinant;
			if(determinant == false || determinant == undefined){
				Bar.findOneAndUpdate({location: location, 'bars.name':name}, {$inc:{'bars.$.attending': 1}}, function(err,bar){
					if(err){return res.send(err);}
					return res.send({success:true, message: 'attending incremented!', deter:true, bar:bar});
				});
			}else{
				Bar.findOneAndUpdate({location: location, 'bars.name':name}, {$inc:{'bars.$.attending': -1} }, function(err,bar){
					if(err){return res.send(err);}
					//if the bar's attending field == 0, we want to delete it from our database :)
					
					return res.send({success:true, message: 'attending decremented!', deter:false, bar:bar});
				});
			}

		});
    
    return router;
    
    
};//end module exports