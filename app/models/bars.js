var mongoose = require('mongoose');

var BarSchema = mongoose.Schema({
	location: {type: String ,index:{unique: true}},
	bars: [{
		name: String,
		attending: Number
	}]
});

module.exports = mongoose.model('Bar', BarSchema);