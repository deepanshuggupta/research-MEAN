angular.module("researchApp")
	
	.service("signupFactory", ['$http','$location', function($http,$location) {

		this.sendData = function(newUser){
			
			$http.post('/signup', newUser)
				.then(function(res){
					if(res.data){
						$location.path("login");
					} 
					else{
						alert("This Email is already present");
						$location.path("signup");
					}
				})
		}
		
	}])

	.service("loginFactory", ['$http','$location', function ($http, $location) {
		
		this.loginMessageDisplay = false;
		this.sendData = function(user, myFunction){
			if(user.role == "Publisher"){
				$http.post('/loginPublisher', user).then(function(res){
					myFunction(res.data.token, res.data.role);
				});
			}
			else{
				$http.post('/loginAuthor',user).then(function(res){
					myFunction(res.data.token, res.data.role);
				});			
			}
		}
	}])


	.service("userHomeFactory", ['$http','$location', function ($http, $location) {
		
		this.categories = ['Economics', 'Law Department', 'Computer Science'];
		this.getPublishers = function(userToken, callback){
			//console.log(userToken);
			$http.get('/getPublishers', {headers: {"authorization": userToken}})
				.then(function(res){
					callback(res.data);
				});
		}

		this.by_profile = function(Publishers){
			var count =0;
			var data = [];
			for(key in Publishers){
				var obj = Publishers[key];
				if(obj['pubAbout'] && obj.pubAbout.length>50 && obj.pubApplyBy.length>2){
					data[count] = obj;
					count++;
				}
			}
			return data;
		}

	}])


	.service("ApplicationSubmitFactory", ['$http','$location', function ($http, $location) {
		
		var fd = new FormData();
		this.sendData = function (application, callback) {
			fd.append('authorization', application.authorization);
			fd.append('title', application.title);
           	fd.append('department', application.department);
           	fd.append('name', application.name);
           	fd.append('pubId', application.pubId);
           	fd.append('phone', application.phone);
           	fd.append('correspondingAuthor', application.correspondingAuthor);
           	fd.append('manTitle', application.manTitle);
           	fd.append('manAbstract', application.manAbstract);
           	fd.append('status', application.status);
           	fd.append('doc', application.doc);
           	$http.post('/submitAppliation',fd, {transformRequest: angular.identity,headers: {'Content-Type': undefined}})
				.then(function(res){
					console.log(res.data.success);
					callback(res.data.success);
				});

		}
		
	           	

	}])


	.service("userDashboardFactory", ['$http','$location', function ($http, $location) {
		
		this.getData = function(userToken,callback){
			$http.get("/getApplications", {headers: {"authorization": userToken}}).then(function(res){
				//console.log(res.data.apps);
				 callback(res.data.apps);
			})
		}
		
	}])

	.service("ApplicationFactory", ['$http','$location', function ($http, $location) {
		
		this.getData = function(appId,callback){
			$http.get("/getApp",{headers: {"id": appId}} ).then(function(res){
				callback(res.data.app);
			})
		}
		this.download = function(link){
			$http.post('/getFile', {url:link},{responseType: 'arraybuffer'},).then(function(res){
				//console.log(res);
				var file = new Blob([res.data], {type: 'application/pdf'});
           		var fileURL = URL.createObjectURL(file);
           		window.open(fileURL);	
			})
		}
		
	}])

	.service("PublisherHomeFactory", ['$http','$location', function ($http, $location) {
		
		this.getData = function(userToken,callback){
			$http.get("/getPubApplications", {headers: {"authorization": userToken}}).then(function(res){
				console.log(res.data.apps);
				callback(res.data.apps);
			})

		}
		this.sendData = function(app, callback){
			$http.post("/rateApplication", {app: app}).then(function(res){
				callback(res.data.appln);
			})
		}
		
		
	}])

	.service("PublisherEditFactory", ['$http','$location', function ($http, $location) {
		
		this.getData = function(userToken,callback){
			$http.get("/getCurrentPublisher", {headers: {"authorization": userToken}}).then(function(res){
				 console.log(res.data.publisher);
				 callback(res.data.publisher);
			})

		}
		this.sendData = function(app, callback){
			$http.post('/savePublisherChanges', {user:app})
				.then(function(res){
					callback(res.data.publisher);
				})
		}
		
		
	}])

;