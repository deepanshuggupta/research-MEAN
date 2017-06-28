//imports
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var path = require('path');
var assert = require('assert');

var bcrypt = require('bcrypt');
// database connection
var url = 'mongodb://localhost:27017/researh';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});


var Users = require('./models/users');
var Authors = require('./models/authors');
var Publishers = require('./models/publishers');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());



app.get('/featuredPublishers', function (req, res) {
  
  	db.collection("featuredPublishers").find().toArray(function(err, result){
		if (err) throw err;
		
		return res.send(result);
	});
	
});




// login routing

app.post('/loginPublisher', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	
	res.send(email+ password);
})
app.post('/loginAuthor', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	
	res.send(email+ password);
})


// sign up routing here   


app.post('/signup', function(req, res){
	
	var success=false;
	Users.findOne({userEmail:req.body.userEmail}, function(err, result){
		//console.log(result);
		if (!result) {
			var newUser ={};
			bcrypt.genSalt(10, function(err, salt) {
			    bcrypt.hash(req.body.userPassword, salt, function(err, hash) {
			        // Store hash in your password DB. 
			        newUser = {
						userEmail : req.body.userEmail,
						role : req.body.role,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						userPassword: hash
					}
					Users.create(newUser, function(err, user){
						if(!err) 
							console.log(user);
						if(String(req.body.role) == 'Author'){
							Authors.create(newUser, function(err1, author){
								success = true;
								res.send(success);
								//console.log(author);
							});
						}
						else{
							Publishers.create(newUser, function(err1, publisher){
								success = true;
								res.send(success);
								//console.log(publisher);
							});
						}
						
					});
				
			    });
			});


		}
		else{
			success = false;
			res.send(success);
		}
		
	})

})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})