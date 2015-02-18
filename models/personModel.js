// Requires mongoose
var mongoose = require('mongoose');

// Creates new Schema out of mongoose
var personSchema = mongoose.Schema({
	oauthID : Number,
	name : String,
	created: String,
	displayName:String
});

// Definition of the model in the models file
var Person = mongoose.model('Person', personSchema);

// Export the model
module.exports = Person;