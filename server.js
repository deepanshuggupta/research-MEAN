var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myappdatabase');

var Schema = mongoose.Schema;

var featuredPublishersSchema = new Schema({
	pub_title: { type: String, required: true, unique: true },
  	pub_about: { type: String, required: true }
});

var featuredPublisher = mongoose.model('featuredPublisher', featuredPublishersSchema);


var app = express();

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello World!');
  
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})