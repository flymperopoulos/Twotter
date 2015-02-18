var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js')
var path = require('path');
var Person = require(path.join(__dirname,'./models/personModel'));
var config = require('./oauth.js')

// config
module.exports = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
	Person.findOne({ oauthID: profile.id }, function(err, user) {
		if(err) { 
			console.log(err); 
		}
		if (!err && user != null) {
		  done(null, user);
		} else {

				var getTimeStamp = function (){
					var timeCurrent = new Date();
					var timeStap =  timeCurrent.getDate() + '/' + timeCurrent.getMonth() + '/' + timeCurrent.getFullYear() + '@' + timeCurrent.getHours() + ":" + timeCurrent.getMinutes() + ":" + timeCurrent.getSeconds();
					return timeStap;
				}
				var displayTime = getTimeStamp();
				var displayWithUnder = profile.displayName.replace(/ /g,"_");


			  var user = new Person({
			    oauthID: profile.id,
			    name: profile.displayName,
			    created: displayTime,
			    displayName: displayWithUnder
			  });

			  user.save(function(err) {
				    if(err) {
				      console.log(err);
				    } else {
				      console.log("saving user ...");

				      done(null, user);
				    };
			  	});
		};
	});
}
));