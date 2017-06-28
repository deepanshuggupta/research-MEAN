var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');



// Mongo DB connection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/researh";
var db=null;
MongoClient.connect(url, function(err, dbconn){
		if (!err)  db = dbconn;
		
});





var app = express();


app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/featuredPublishers', function (req, res) {
  
  	db.collection("featuredPublishers").find().toArray(function(err, result){
		if (err) throw err;
		//console.log(result);
		return res.send(result);
	});
	
});

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

app.post('/signup', function(req, res){
	
	db.collection("featuredPublishers").find().toArray(function(err, result){
		if (err) throw err;
		//console.log(result);
		return res.send(result);
	});



	var email = req.body.userEmail;
	var password = req.body.userPassword;
	
	res.send(email+ password);
	console.log(req.body);
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})