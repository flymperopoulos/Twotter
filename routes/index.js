// Requires path modulo and the models Person and Twotte
var path = require('path');
var Person = require(path.join(__dirname,'../models/personModel'));
var Twotte = require(path.join(__dirname,'../models/twotteModel'));

// ErrorHandler method
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

// Initializes routes new object
var routes = {};

// Keeps track of time for timestamps on twottes
var getTimeStamp = function (){
	var timeCurrent = new Date();
	var timeStap = timeCurrent.getDate() + '/' + timeCurrent.getMonth() + '/' + timeCurrent.getFullYear() + '@' + timeCurrent.getHours() + ":" + timeCurrent.getMinutes() + ":" + timeCurrent.getSeconds();
	return timeStap;
}

// Home method renders home.handlebars
routes.home = function(req, res) {
	console.log('check1');
	Person.find({}, function (err, peopleNew){
		if (err) {
			errorHandler(err, req, res);
		} else {
			Twotte.find({}, null, {sort:{timestamp:-1}}, function (err, twottesNew){
				if (err) {
					errorHandler(err, req, res);
				} 

				var loggedIn;

				if (req.session._id){
					loggedIn = true
				} else {
					loggedIn = false
				}
				console.log('Am I logged in?');
				console.log(loggedIn);

				var CompletePageData = {
					name: req.session.name,
					message: req.session.message,
					people : peopleNew,
					twottes : twottesNew,
					loggedIn: loggedIn
				}

				console.log('check3');

				res.render('home', CompletePageData);
			})
		}
	})
}

routes.login = function(req, res){
	console.log(req.body.name);

	var newPerson = new Person({'name':req.body.name});

	Person.find({name:newPerson.name},null, {sort:{timestamp:-1}}, function (err,data){
		if (data.length === 0) {
			// save to the database
			newPerson.save(function (err, user){
				if (err) {
					errorHandler(err, req, res)
				} else {
					console.log('No errors and new person created.');
				  	Person.findOne(newPerson, function (err,data){
		  			  	if (err){
		  			  		console.log('An error occured here.');
		  			  	}
		  			  	else {
		  			  		console.log('Checking ids');
		  			  		console.log(user._id);

		  			  		req.session._id = user._id;

		  			  		req.session.name = user.name;

		  			  		var ResSessObj = {
		  			  			'_id' : req.session._id,
		  			  			'name' : req.session.name,
		  			  			loggedIn: true
		  			  		}

		  			  		console.log(ResSessObj);
		  			  		res.json(ResSessObj);
		  			  	} 
					})
				}
			});
		} else {

			req.session._id	= data[0]._id;
			req.session.name = data[0].name;

			var ResSessObj = {
				'_id' : req.session._id,
				'name' : req.session.name,
				loggedIn: true
			}

			console.log('resulting person obj',ResSessObj);

			res.json(ResSessObj);
		}
	})
}

routes.logout = function (req, res){

	req.session._id = "";
	req.session.name = "";
	res.status(200).end();
}


routes.postTwotte = function (req, res){

	var author = req.session.name;
	var message = req.body.message;
	var displayTime = getTimeStamp();

	var newTwotte = new Twotte({
		author:author, 
		message:message,
		timestamp: displayTime
	});

	newTwotte.save(function (err, twotte){
		if (err) {
			errorHandler(err, req, res)
		} else {
			res.json(twotte);
		}
	})
}

routes.deleteTwotte = function (req, res) {
	var twotteIdToRemove = req.body.idToDelete;

	console.log('idToRemove',twotteIdToRemove);

	Twotte.findOne({'_id':twotteIdToRemove}, function (err,data){	
		if (err){
			console.log("error with removing")
		} else {

			if (data.author === req.session.name){

				 data.remove(function(err) {
					if (err){
						errorHandler(err,req,res);
					}
					console.log('A twotte was deleted');
					res.end();
				})
			}
		}
		
	});
}

module.exports = routes;