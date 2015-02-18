// Requires path modulo and the models Person and Twotte
var path = require('path');
var Person = require(path.join(__dirname,'../models/personModel'));
var Twotte = require(path.join(__dirname,'../models/twotteModel'));

// ErrorHandler method
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

var getTimeStamp = function (){
	var timeCurrent = new Date();
	var timeStap =  timeCurrent.getHours() + ":" + timeCurrent.getMinutes() + ":" + timeCurrent.getSeconds();
	return timeStap;
}

// Initializes routes new object
var routes = {};

// Home method renders home.handlebars
routes.home = function(req, res) {
	console.log('entered routes.home')
	Person.find({}, function (err, peopleNew){
		if (err) {
			errorHandler(err, req, res);
		} else {
			Twotte.find({}, null, {sort:{timestamp:-1}}, function (err, twottesNew){
				if (err) {
					errorHandler(err, req, res);
				} 

				var CompletePageData = {
					people : peopleNew,
					twottes : twottesNew
				}

				console.log('prints CompletePageData: ', CompletePageData);

				res.render('home', CompletePageData);
			})
		}
	})
}

routes.account = function(req, res){
	console.log('got in routes.account');

	Person.findById(req.session.passport.user, function(err, user) {
 		if(err) {
  			res.status(500).send({'error':err});
  			console.log(err);
 		} else {

 			Twotte.find({}, null, {sort:{timestamp:-1}}, function (err, twottesNew){
 				if (err) {
 					errorHandler(err, req, res);
 				} 
 				Person.find({}, function(err, peopleNew){
 					if (err){
 						errorHandler(err, req, res);
 					} 				

	 				displayName = user.name.replace(/ /g,"_");
	 				console.log('displayName: ', displayName);

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

routes.postTwotte = function (req, res){
	Person.findById(req.session.passport.user, function(err, user) {
 		if(err) {
  			console.log(err);
 		} else {

 			var passportObj = req.session.passport;
			var passportAuthor = user.name;
			var message = req.body.message;
			var displayTime = getTimeStamp();

			var newTwotte = new Twotte({
				author:passportAuthor, 
				message:message,
				timestamp: displayTime,
				displayName : user.name.replace(/ /g,"_")
			});

			// console.log('new twotte',newTwotte);
			newTwotte.save(function (err, twotte){
				if (err) {
					res.status(500).send({'error':err});
					console.log(err);
					errorHandler(err, req, res);
				} else {
					console.log('chris wants twotte: ',twotte);

					res.json(twotte);
				}
			})

 		}
	});
}

routes.deleteTwotte = function (req, res) {
	var twotteIdToRemove = req.body.idToDelete;

	console.log('idToRemove',twotteIdToRemove);

	Twotte.findOne({'_id':twotteIdToRemove}, function (err,data){	
		if (err){
			console.log("error with removing")
		} else {

			 data.remove(function(err) {
				if (err){
					errorHandler(err,req,res);
				}
				console.log('A twotte was deleted');
				res.end();
			})
		}
	});
}

routes.logout = function (req, res){
	req.logout();
	res.redirect('/');
}

module.exports = routes;