var mongoose = require('mongoose');

var BarSchema = mongoose.Schema({
	name: {type: String ,index:{unique: true}},
	attending: Number
});

module.exports = mongoose.model('Bar', BarSchema);