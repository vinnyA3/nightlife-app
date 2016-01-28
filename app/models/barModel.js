var mongoose = require('mongoose');

var BarSchema = mongoose.Schema({
	location: {type: String, index:{unique:true}},
	bars: [{
		name: {type: String, index:{unique:true}},
		attending: Number
	}]
});

module.exports = mongoose.model('Bar', BarSchema);