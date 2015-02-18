// Requires path modulo and the models Person and Twotte
var path = require('path');
var Person = require(path.join(__dirname,'../models/personModel'));
var Twotte = require(path.join(__dirname,'../models/twotteModel'));

// ErrorHandler method
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

// method that records current time
var getTimeStamp = function (){
	var timeCurrent = new Date();
	var timeStap =  timeCurrent.getHours() + ":" + timeCurrent.getMinutes() + ":" + timeCurrent.getSeconds();
	return timeStap;
}

// Initializes routes new object
var routes = {};

// Home method renders home.handlebars
routes.home = function(req, res) {

	// looks through the whole list of Person objects 
	Person.find({}, function (err, peopleNew){
		if (err) {
			errorHandler(err, req, res);
		} else {
			// searches through all twottes and sorts based on time (reverse - newest one on top)
			Twotte.find({}, null, {sort:{timestamp:-1}}, function (err, twottesNew){
				if (err) {
					errorHandler(err, req, res);
				} 

				// data of twottes and people
				var CompletePageData = {
					people : peopleNew,
					twottes : twottesNew
				}

				res.render('home', CompletePageData);
			})
		}
	})
}

// called after authenticated from GET request at '/account'
routes.account = function(req, res){

	// looks by id in the passport session for the user that got authenticated 
	Person.findById(req.session.passport.user, function(err, user) {
 		if(err) {
 			errorHandler(err, req, res);
 		} else {

 			// looks for all twottes and sorts by reverse time
 			Twotte.find({}, null, {sort:{timestamp:-1}}, function (err, twottesNew){
 				if (err) {
 					errorHandler(err, req, res);
 				} 
 				Person.find({}, function(err, peopleNew){
 					if (err){
 						errorHandler(err, req, res);
 					} 				

 					// replacing ' ' with '_' for better class reference of unique authenticated person name
	 				var displayName = user.name.replace(/ /g,"_");

	 				// data that will render account.handlebars
	 				var CompletePageData = {
	 					people : peopleNew,
	 					twottes : twottesNew,
	 					name:user.name,
	 					displayName:displayName
	 				}

	   				res.render('account', CompletePageData);
   				})
   			})
 		}
	});
}

// called when a twotte is submitted
routes.postTwotte = function (req, res){

	// looks database based on ID
	Person.findById(req.session.passport.user, function(err, user) {
 		if(err) {
  			console.log(err);
 		} else {

 			// declares the passport object and gets name and message from request
 			var passportObj = req.session.passport;
			var passportAuthor = user.name;
			var message = req.body.message;
			var displayTime = getTimeStamp();

			// creates new twotte 
			var newTwotte = new Twotte({
				author:passportAuthor, 
				message:message,
				timestamp: displayTime,
				displayName : user.name.replace(/ /g,"_")
			});

			// saves this new twotte
			newTwotte.save(function (err, twotte){
				if (err) {
					errorHandler(err, req, res);
				} else {

					// sends twotte as json
					res.json(twotte);
				}
			})

 		}
	});
}

// method when deleting twotte
routes.deleteTwotte = function (req, res) {

	// gets the id to be removed from the request
	var twotteIdToRemove = req.body.idToDelete;

	// finds this twotte with the unique ID from the Twottes array of objects
	Twotte.findOne({'_id':twotteIdToRemove}, function (err,data){	
		if (err){
			console.log("error with removing")
		} else {

			// removes from database
			 data.remove(function(err) {
				if (err){
					errorHandler(err,req,res);
				}
				res.end();
			})
		}
	});
}

// logout method
routes.logout = function (req, res){
	req.logout();
	res.redirect('/');
}

module.exports = routes;