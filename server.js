var express = require('express');
var mongo = require('mongodb');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/researh";




var app = express();



app.use(express.static('public'))

app.get('/featuredPublishers', function (req, res) {
  MongoClient.connect(url, function(err, db){
  	if (err) throw err;
  	db.collection("featuredPublishers").find().toArray(function(err, result){
		if (err) throw err;
		console.log(result);
		res.send(result);
	});
	db.close();
  });

})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})