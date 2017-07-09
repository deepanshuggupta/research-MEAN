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
var formparse = require('express-formparse');


//schemas
var Users = require('./models/users');
var Authors = require('./models/authors');
var Publishers = require('./models/publishers');
var Applications = require('./models/application');
var JWT_SECRET = 'mysecret';


// database connection
var url = 'mongodb://localhost:27017/researh';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});


//express middlewares
var app = express();
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


// routing

// for Home Page
app.get('/featuredPublishers', function (req, res) {
  
  	var featuredPublishers = [
  		{
  			title:'TMH publications',
  			about: 'At McGraw Hill Education, we believe that our contribution to unlocking a brighter future lies within the application of our deep understanding of how learning happens and how the mind develops. It exists where the science of learning meets the art of teaching.'
  		},
  		{
  			title:'TMH publications',
  			about: 'At McGraw Hill Education, we believe that our contribution to unlocking a brighter future lies within the application of our deep understanding of how learning happens and how the mind develops. It exists where the science of learning meets the art of teaching.'
  		},
  		{
  			title:'TMH publications',
  			about: 'At McGraw Hill Education, we believe that our contribution to unlocking a brighter future lies within the application of our deep understanding of how learning happens and how the mind develops. It exists where the science of learning meets the art of teaching.'
  		},
  		{
  			title:'TMH publications',
  			about: 'At McGraw Hill Education, we believe that our contribution to unlocking a brighter future lies within the application of our deep understanding of how learning happens and how the mind develops. It exists where the science of learning meets the art of teaching.'
  		}
  	];
  	
  	/*Users.find({}, function(err , result){
  		console.log(result);
  	})*/

	return res.send(featuredPublishers);

});

// Sign up Routing 
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
							//console.log(user);
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

// Login Publisher routing

app.post('/loginPublisher', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	Users.findOne({userEmail:email}, function(err, user){
		if(user){
			bcrypt.compare(password, user.userPassword, function(err, result) {
			    if(result){
			    	Users.findOne({userEmail:email}, function(err, checkuser){
			    		var mytoken = jwt.encode(checkuser, JWT_SECRET);
			    		return res.json({token:mytoken,role:'Publisher'});
			    	})
			    }
			    else return res.json({token:null, role:null})
			});
		}
		else return res.json({token:null, role:null})
	})
})


app.post('/loginAuthor', function(req, res){
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	Users.findOne({userEmail:email}, function(err, user){
		if(user){
			bcrypt.compare(password, user.userPassword, function(err, result) {
			    if(result){
			    	Users.findOne({userEmail:email}, function(err, checkuser){
			    		var mytoken = jwt.encode(checkuser, JWT_SECRET);
			    		return res.json({token:mytoken, role:'Author'});
			    	})
			    }
			    else return res.json({token:null, role:null})
			});
		}
		else return res.json({token:null, role:null})
	})
	
})

//get all the publishers for the User_home
app.get('/getPublishers', function(req, res){
	var token = req.headers['authorization'];
	var user = jwt.decode(token, JWT_SECRET);
	//console.log(user);
	Publishers.find({}, function(err, result){
		if (result){
			res.json(result);
			console.log(result);
		}
		else{
			res.json({result:''})
			console.log("Data not found")
		}
	})
})


//to Submit Application in author home page
app.post('/submitAppliation', bodyParser.json({inflate: false}), function(req, res){
	
	var token = req.body.authorization;
	var user = jwt.decode(token, JWT_SECRET);
	console.log(user);
	var oldName = req.body.doc.path;
	var newName = './docs/' + req.body.name + '_' + req.body.title + '_'+ 'random '+ '.pdf';
	fs.rename(oldName, newName, function(err) {
	    if ( err ) console.log('ERROR: ' + err);
	    var app = req.body;
	    app.authorEmail = user.userEmail;
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

//for User Dashboard
app.get('/getApplications', function(req, res){
	var token = req.headers['authorization'];
	var user = jwt.decode(token, JWT_SECRET);
	console.log(user);
	Applications.find({authorEmail:user.userEmail}, function(err, apps){
		if(!err){
			console.log(apps);
			return res.json({apps:apps});
		}
		else{
			console.log("Error occured");
			return res.json({apps:[]});
		}
	})

})

//to view current submitted application
app.get('/getApp', function(req, res){
	
	var id = req.headers['id'];
	Applications.findOne({_id:id}, function(err, result){
		if(!err){
			//console.log(result);
			return res.json({app:result});
		}
		else{
			console.log("Got an error");
			return res.json({app:{}});
		}
	})
})

//to Download the files
app.post('/getFile', function(req,res){
	var url = String(req.body.url);
	console.log(url);
	fs.readFile(url , function (err,data){
		//console.log(data);
       	res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename=some_file.pdf',
			'Content-Length': data.length
		});
        res.end(data);
    });
})


//for P*ublisher Home
app.get('/getPubApplications', function(req, res){
	var token = req.headers['authorization'];
	var user = jwt.decode(token, JWT_SECRET);
	//console.log(user);
	Users.findOne({_id:user._id}, function(err, result){
		console.log(result);
		Publishers.findOne({userEmail:result.userEmail}, function(err, publisher){
			console.log(user);
			Applications.find({pubId:publisher._id}, function(err, apps){
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
	})
	

})


//Rate the request by user only
app.post('/rateApplication', function (req, res) {
	console.log(req.body);
	Applications.findOneAndUpdate(
		{_id:req.body.app._id}, 
		{$set:
			{
				rating:req.body.app.rating,
				status:req.body.app.status,
				comment:req.body.app.comment
				
			}

		},
		{new: true},
		function(err, appln){
			if(appln){
				console.log(appln);
				res.json({appln:appln});
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


app.get('/getCurrentPublisher', function(req, res){
	var token = req.headers['authorization'];
	var user = jwt.decode(token, JWT_SECRET);
	Publishers.findOne({userEmail: user.userEmail}, function(err, publisher){
		if(publisher){
			res.json({publisher:publisher});
		}
		else{
			console.log("publisher not found,  so sad");
			res.json({publisher:''})

		}
	})
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


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})