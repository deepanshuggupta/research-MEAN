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
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var fs = require('fs');
var categoryconvertor = require('./script');
//var formidable = require('express-formidable');
var formparse = require('express-formparse');
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
var Applications = require('./models/application');
var app = express();

var JWT_SECRET = 'mysecret';
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(formidable({encoding: 'utf-8',uploadDir: './docs/'}));
app.use(formparse.parse({
    encoding: 'utf8',
    uploadDir: './docs/',
    keepExtensions: true
    
}));

app.get('/featuredPublishers', function (req, res) {
  
  	db.collection("featuredPublishers").find().toArray(function(err, result){
		if (err) throw err;
		
		return res.send(result);
	});
	
});

//get all the publishers 
app.get('/getPublishers', function(req, res){
	Publishers.find({}, function(err, result){
		if (result){
			res.json(result);
			//console.log(result);
		}
		else{
			res.json({result:''})
			console.log("Data not found")
		}
	})
})
app.post('/getCurrentAuthor', function(req, res){
	var email = req.body.user;
	Authors.findOne({userEmail: email}, function(err, author){
		if(author){
			console.log(author);
			res.json({author:author});
		}
		else{
			console.log("Author not found");
			res.json({author:''})

		}
	})
})


app.post('/getCurrentPublisher', function(req, res){
	var email = req.body.user;
	
	Publishers.findOne({userEmail: email}, function(err, publisher){
		if(publisher){
			//console.log("I am here")
			//console.log(publisher);
			res.json({publisher:publisher});
		}
		else{
			console.log("publisher not found,  so sad");
			res.json({publisher:''})

		}
	})
})


app.post('/submitAppliation', bodyParser.json({inflate: false}), function(req, res){
	
	var oldName = req.body.doc.path;
	var newName = './docs/' + req.body.name + '_' + req.body.title + '_'+ req.body.manTitle+ '.pdf';
	fs.rename(oldName, newName, function(err) {
	    if ( err ) console.log('ERROR: ' + err);
	    var app = req.body; 
	    app.docUrl = newName;
	    Applications.create(app, function(err, result){
	    	if(!err){
	    		console.log(result);
	    		return res.json({success:true})	;
	    	}
	    	else{
	    		return res.json({success:false});
	    	}
	    	
	    })
	});
	
})



app.post('/savePublisherChanges', function(req, res){
	var user = req.body.user;
	
	var email = req.body.user.userEmail;
	user.categories = categoryconvertor(req.body.user.categories);
	user.subCategories = categoryconvertor(req.body.user.subCategories);
	Publishers.findOneAndUpdate(
		{userEmail:email}, 
		{$set:
			{
				firstName:user.firstName,
				lastName:user.lastName,
				pubTitle:user.pubTitle,
				pubAbout:user.pubAbout,
				categories:user.categories,
				subCategories:user.subCategories,
				pubApplyBy:user.pubApplyBy
			}

		},
		{new: true},
		function(err, publisher){
			if(publisher){
				console.log(publisher);
				res.json({publisher:publisher});
			}	
		})
	

})

app.post('/getApplications', function(req, res){
	var authorEmail = req.body.user;
	
	console.log(req.body);
	Applications.find({authorEmail:req.body.user}, function(err, apps){
		if(!err){
			//console.log(apps);
			return res.json({apps:apps});
		}
		else{
			console.log("Error occured");
			return res.json({apps:[]});
		}
	})

})



// login routing

app.post('/loginAuthor', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	Authors.findOne({userEmail:email}, function(err, author){
		if(author){
			bcrypt.compare(password, author.userPassword, function(err, result) {
			    if(result){
			    	console.log("Matched");
			    	var mytoken = jwt.encode(author, JWT_SECRET);
			    	//console.log(mytoken);
			    	return res.json({token:mytoken});
			    }
			    else{
			    	return res.json({token:''})
			    	//res.status(400).send('Bad Request');
			    	//console.log("Unmatched");
			    }
			});
		}
		else{
			return res.json({token:''})
			console.log("Unmatched");
		}
		//else console.log("Not find");
	})
	
})
app.post('/loginPublisher', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	
	Publishers.findOne({userEmail:email}, function(err, publisher){
		if(publisher){
			bcrypt.compare(password, publisher.userPassword, function(err, result) {
			    if(result){
			    	console.log("Matched");
			    	var mytoken = jwt.encode(publisher, JWT_SECRET);
			    	//console.log(mytoken);
			    	return res.json({token:mytoken});
			    }
			    else{
			    	return res.json({token:''})
			    	//res.status(400).send('Bad Request');
			    	console.log("Unmatched");
			    }
			});
		}
		else{
			return res.json({token:''})
			console.log("Unmatched");
		}
		
	})
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
								console.log(author);
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