var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev')); 
	app.use(express.cookieParser());
	app.use(express.bodyParser({
		keepExtensions: true, 
        uploadDir: __dirname + '/public/files'
	}));
	app.set('view engine', 'ejs');
	app.use(express.session({ secret: 'This is Secret' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(function(req, res, next) {
      	res.header("Access-Control-Allow-Origin", "*");
      	res.header("Access-Control-Allow-Headers", "X-Requested-With");
      	next();
    });
});

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);