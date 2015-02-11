// Requires mongoose
var mongoose = require('mongoose');

// Creates new Schema out of mongoose
var twotteSchema = mongoose.Schema({
	timestamp : Number,
	oauthId : String,
	author: String,
	message: String
});

// Definition of the model in the models file
var Twotte = mongoose.model('Twotte', twotteSchema);

// Export the model
module.exports = Twotte;