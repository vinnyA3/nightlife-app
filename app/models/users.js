//users.js 
//require mongoose
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');


var UserSchema = mongoose.Schema({
        name: String,
        email: {type: String, index:{unique: true}},
        password: {type: String, select:false}
});

//methods
//generate password hash
UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8, null));  
};

//compare passwords && validate
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);