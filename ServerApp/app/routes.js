var Project = require('./models/project');
var Feedback = require('./models/feedback');
var fs = require('fs');
var path = require('path'),
    appDir = path.dirname(require.main.filename);

module.exports = function(app, passport) {
	app.all('/', function(req, res, next) {
	  	res.header("Access-Control-Allow-Origin", "*");
	  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  	next();
	});

	app.get('/', function(req, res) {
		if (req.isAuthenticated())
			res.redirect('/profile');
		else 
			res.redirect('/login');
	});

	app.get('/login', CheckLogin, function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', CheckLogin, function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/api/projects/:companyID', function(req, res) {
		Project.find({
			companyID: req.params.companyID
		}, function(err, projects) {
			if (err)
				res.send(err)
			res.json(projects);
		});
	});

	app.post('/api/projects', function(req, res) {
		Project.create({
			name: req.body.name,
			companyID: req.body.companyID
		}, function(err, project) {
			if (err)
				res.send(err);

			Project.find({
				companyID: req.body.companyID
			}, function(err, projects) {
				if (err)
					res.send(err)
				res.json(projects);
			});
		});
	});

	app.get('/api/feedback/:projectID', function(req, res){
		Feedback.find({
			projectID: req.params.projectID
		}, function(err, feedbacks) {
			if (err)
				res.send(err);
			res.json(feedbacks);
		});
	});

	app.post('/api/feedback', function(req, res){
		var data_url = req.body.image;
		var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
		var ext = matches[1];
		var base64_data = matches[2];
		var buffer = new Buffer(base64_data, 'base64');
		var Gid = guid();

		fs.writeFile(appDir + '/public/files/'+ Gid + '.' + ext +'', buffer, function (err) {
		  	if (err)
				res.json(err);
		  	Feedback.create({
				text: req.body.text,
			    projectID: req.body.projectID,
			    image: '/files/'+ Gid + '.' + ext,
			    type: req.body.type,
			    browser: req.body.browser,
			    OS: req.body.OS
			}, function(err, feedback) {
				if (err)
					res.jsonp(err);
				res.jsonp({ "saved": true });
			});
		});
	});

	app.get('/api/:projectId', function(req, res){
		Project.find({
			_id: req.params.projectId
		}, function(err, project) {
			if (err)
				res.jsonp(err);
			res.jsonp({'proceed': true});
		});
	});
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function CheckLogin(req, res, next) {
	if (req.isAuthenticated())
		res.redirect('/');
	else 
		return next();
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}