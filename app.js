var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

var index = require('./routes/index');

var app = express();

var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

// Set up Templating
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set up Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
}));

// GET requests
app.get('/', index.home);

// POST requests 
app.post('/login', index.login);
app.post('/addTwotte', index.postTwotte);
app.post('/logout', index.logout);
app.post('/deleteTwotte', index.deleteTwotte);

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});
