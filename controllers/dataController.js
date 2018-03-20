var view 		= require('swig'),
	bodyParser 	= require('body-parser'),
	connect		= require('../connection/db');

var urlencodeParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

	function authenticationMiddleware(){
		return (req, res, next) => {

			if (req.isAuthenticated()) return next();

			res.redirect('/login');
		}
	}
	
	app.get('/data', authenticationMiddleware(), function(req, res){ 
		var data = view.compileFile('./template/data.html');

		connect.query("select * from mahasiswa", function(err, rows, field){
			/*if (err) throw err;*/

			res.end(data({data: rows}));
		});

	});

	app.get('/tambah-data', authenticationMiddleware(), function(req, res){ 
		var html = view.compileFile('./template/addData.html');
		res.end(html());

	});

	app.post('/tambah-data', authenticationMiddleware(), function(req, res){ 
	
		connect.query("insert into mahasiswa set ?", req.body, function(err, rows, field){
			if (err) throw err;
			res.redirect('/');
		});
	});

	app.get('/update-data/:nim', authenticationMiddleware(), function(req, res){ 

		connect.query("select * from mahasiswa where ?", {nim: req.params.nim}, function(err, rows, field){
			if (err) throw err;

			var data = rows[0];
			var html = view.compileFile('./template/updateData.html');
			res.end(html({data:data}));

		});

	});

	app.post('/update-data/:nim', authenticationMiddleware(),  function(req, res){ 
		
		connect.query("update mahasiswa set ? where ?", [req.body, {nim:req.params.nim}], function(err, rows, field){
			if (err) throw err;
			res.redirect('/');
		});

	});

	app.get('/delete/:nim', authenticationMiddleware(), function(req, res){ 
		
		connect.query("delete from mahasiswa where ?", {nim:req.params.nim}, function(err, rows, field){
			if (err) throw err;
			res.redirect('/');
		});
	});

	app.get('/about', function(req, res){ 
		var html = view.compileFile('./template/about.html');
		
		var data = html({
			title: "About Page"
		})
		res.end(data);
	});

	app.get('/contact', function(req, res){ 
		var html = view.compileFile('./template/contact.html');
		
		var data = html({
			title: "Contact Page"
		})
		res.end(data);
	});
}