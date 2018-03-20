var mysql = require('mysql');

var connection = mysql.createConnection({
	host 		: "localhost",
	port 		: 3306,
	database	: "new-node",
	user 		: "root",
	password 	: ""
});

connection.connect();

module.exports = connection;