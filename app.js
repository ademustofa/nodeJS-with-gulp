var express 		= require('express');
var dataController 	= require('./controllers/dataController');
var authController 	= require('./controllers/authController');
var passport	= require('passport');
var session 	= require('express-session');
var	MySQLStore 	= require('express-mysql-session')(session);
var validator		= require('express-validator');
var bodyParser 	 	= require('body-parser');

var app = express();
var options = {
		host 		: "localhost",
		port 		: 3306,
		database	: "new-node",
		user 		: "root",
		password 	: ""
	};
var sessionStore = new MySQLStore(options);


app.use(validator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: '&^@">?@&^asdhk(*!^asdjhakdakdhakhdak',
	resave: true,
	store: sessionStore,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static(__dirname + '/public'));
app.use("/public2", express.static(__dirname + '/node_modules'));

dataController(app);
authController(app);

app.listen(8888);

console.log('You Connected to Server port 8888');