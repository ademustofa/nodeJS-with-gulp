var view 		= require('swig'),
	session 	= require('express-session'),
	connect		= require('../connection/db'),
	bcrypt 		= require('bcrypt'),
	passport	= require('passport'),
	LocalStrategy = require('passport-local').Strategy;


var saltRounds = 10;

module.exports = function(app){

	passport.use(new LocalStrategy(
		function(username, password, done) {

			connect.query('SELECT id, username, password FROM users WHERE username = ?', [username], function(err, rows, field){
				if (err) throw err;

				if (rows.length === 0) {
					done(null, false);
				} else{
					var hash = rows[0].password.toString();
					bcrypt.compare(password, hash, function(err, response){
						if (response === true) {
							return done(null, {user_id: rows[0].id, name: rows[0].username});
						} else {
							return done(null, false);
						}
					});
				}

			});
		}
	));

	passport.serializeUser(function(user_id, done) {
	  done(null, user_id);
	});

	passport.deserializeUser(function(user_id, done) {
	    done(null, user_id);
	});

	function authenticationMiddleware(){
		return (req, res, next) => {

			if (req.isAuthenticated()) return next();

			res.redirect('/login');
		}
	}

	app.use(function(req, res, next){
		isAuthenticated = req.isAuthenticated();
		user = req.user;
		next();
	});

	app.get('/', function(req, res){
		var home = view.compileFile('./template/home.html');
		res.end(home());
	});

	app.get('/login', function(req, res){
		var login = view.compileFile('./template/login.html');
		res.end(login());
	});

	app.post('/login', passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login'
	}));

	app.get('/dashboard', authenticationMiddleware(), function(req, res){
		var dashboard = view.compileFile('./template/dashboard.html');
		/*console.log(req.user.name);*/
		var data = {
			name: req.user.name
		}
		res.end(dashboard({data: data}));	
	});

	app.get('/logout', function(req, res){
		req.logout(); 
		req.session.destroy();
		res.redirect('/login');
	});

	app.get('/profile', authenticationMiddleware(), function(req, res){
		var profile = view.compileFile('./template/profile.html');
		/*console.log(req.user.name);*/
		res.end(profile());
	});

	app.get('/register', function(req, res){
		var register = view.compileFile('./template/register.html');
		res.end(register());
	});

	app.post('/register', function(req, res){

		req.checkBody('username', 'Username cannot be empty.').notEmpty();
		req.checkBody('username', 'Username must be between 4-15 characterr long.').len(4, 15);
		req.checkBody('email', 'Email was Invalid.').isEmail();
		req.checkBody('password', 'Password must be between 8-100 characterr long.').len(8, 100);
		req.checkBody('retype-pass', 'Retype Password do not macth.').equals(req.body.password);
		var error = req.validationErrors()

		if (error) {
			var register = view.compileFile('./template/register.html');
			res.end(register({errors:error}));
		} else {
			
			bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				var data = {
					username: req.body.username,
					email: req.body.email,
					password: hash
				};
				connect.query('insert into users set ?', data, function(err, rows, field){
					if (err) throw err;

					connect.query('SELECT LAST_INSERT_ID() as user_id', function(error, rows, field){
						if (error) throw error;
						var user_id = rows[0];
						console.log(user_id);
						req.login(user_id, function(err){
							res.redirect('/profile');
						});
					})
				})
			});
			
		}
			
	});

}