var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var layout = require('express-ejs-layouts');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(layout);
app.set('views', path.join(__dirname, '/views/pages'));
var upload = multer({dest:'/public/uploads/'})
var userrole = [];
var resultArray = [];
var url = 'mongodb://localhost:27017/ydiskolaveri';
var jobsArray = []
var alreadyMessage = "";
var message = "";
var searchresults = "";
var a,e,f
var b
var c
var count = 0;
var d
var ObjectId = require('mongodb').ObjectID;
var fund = 0;
var email;

app.get('/', function(req,res){
	b = ""
	c = ""
	d = ""
	a = "active";
	e = "";
	f = "";
	res.render("home1",{a,b,c,d,e,f});
	jobsArray = [];
	searchresults = ""
});

app.get('/register',function(req,res){
	b = ""
	c = ""
	d = ""
	a = "";
	e = "";
	f = "active";
	res.render('register',{alreadyMessage,a,b,c,d,e,f});
	alreadyMessage = "";
	//res.render('/register')
});

app.get('/login',function(req,res){
	b = ""
	c = ""
	d = ""
	e = "active";
	a = "";
	f = "";
	console.log(message);
	res.render("login",{message,a,b,c,d,e,f});
	message = "";
	//res.render('/register')
});

app.get('/forgotpassword',function(req,res){
	b = ""
	c = ""
	d = ""
	e = "active";
	a = "";
	f = "";
	res.render("forgotpassword",{a,b,c,d,e,f,message});
	message = "";
});

app.get('/FAQ',function(req,res){
	b = ""
	c = ""
	a = ""
	d = "active";
	e = "";
	f = "";
	var faqArray = [];
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error");
			res.send("Error in establishing  connection")
		} else {
			var cursor = db.collection('FAQ').find({});

			cursor.forEach(function(doc,err){
				if (err) {console.log("error");}
				else{
					faqArray.push(doc)
				}
			},function(){
				res.render('FAQ',{faqArray,a,b,c,d,e,f});
			});
		}
	});
});

app.get('/projects',function(req,res){
	var projectsArray = [];
	var z = req.query.category;
	b = "active";
	c = "";
	a = "";
	d = "";
	e = "";
	f = "";
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("error");
		} else {
			var cursor = db.collection('projects').find({"category":z,status:"approved"});
			cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					projectsArray.push(doc);
				}
			}, function(){
				res.render('projects',{projectsArray,a,b,c,d,e,f})
			});
		}
	});
});
app.get('/dashboard',function(req,res){
	b = "active";
	c = "";
	a = "";
	d = "";
	e = "";
	f = "";
	res.render('dashboard',{a,b,c,d,e,f})
});
app.get('/startProject',function(req,res){
	b = "";
	c = "active";
	a = "";
	d = "";
	e = "";
	f = "";
	res.render('startProject',{a,b,c,d,e,f})
});
app.get('/userHome',function(req,res){
	var projectsArray = [];
	var z = req.query.category;
	b = "";
	c = "";
	a = "active";
	d = "";
	e = "";
	f = "";
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("error");
		} else {
			var cursor = db.collection('projects').find({"category":z,status:"approved"});
			cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					projectsArray.push(doc);
				}
			}, function(){
				res.render('userHome',{projectsArray,a,b,c,d,e,f})
			});
		}
	});
});
app.get('/admin',function(req,res){
	var projectsArray = [];
	var z = req.query.status;
	b = "";
	c = "";
	a = "active";
	d = "";
	e = "";
	f = "";
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("error");
		} else {
			var cursor = db.collection('projects').find({status:z});
			cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					projectsArray.push(doc);
				}
			}, function(){
				res.render('admin',{projectsArray,a,b,c,d,e,f})
			});
		}
	});
});
app.post('/creditdetails',function(req,res){

	console.log(fund);
	a= "active"
	c = ""
	a = ""
	d = "";
	e = "";
	f = "";
	res.render('creditdetails',{a,b,c,d,e,f})
});
app.get('/description',function(req,res){
	var projectdescr = []
	var id = ObjectId(req.query.id);
	b = "active";
	c = "";
	a = "";
	d = "";
	e = "";
	f = "";
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("error");
		} else {
			var cursor = db.collection('projects').find({"_id":id});
			cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					projectdescr.push(doc);
				}
			}, function(){
				console.log(projectdescr)
				res.render('description',{projectdescr,a,b,c,d,e,f})
			});
		}
	});
});
app.get('/addSuccessStories',function(req,res){
	b = "active";
	c = "";
	a = "";
	res.render('addSuccessStories',{a,b,c,d,e,f})
});
app.get('/successStories',function(req,res){
	b = "active";
	c = "";
	a = "";
	res.render('successStories',{a,b,c,d,e,f})
});
app.post('/jobSearch',function(req,res){

	var jobs = {
		job:req.body.jobs,
		place:req.body.place
	}
	
	
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		}
		else{
			if (jobs.place == "" && jobs.job==""){
				var cursor = db.collection('jobs').find({});
				cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					jobsArray.push(doc);
				}
				},function(){
					searchresults = "Search results "+jobsArray.length;
					res.redirect('/')
					//res.send(jobsArray);
				});
			} else if(jobs.job == "") {
				var cursor = db.collection('jobs').find({"place":jobs.place});
				cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					jobsArray.push(doc);
				}
				},function(){
					searchresults = "Search results "+jobsArray.length;
					res.redirect('/')
					//res.send(jobsArray);
				});
			}else if(jobs.place==""){
				var cursor = db.collection('jobs').find({"job":jobs.job});
				cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					jobsArray.push(doc);
				}
				},function(){
					searchresults = "Search results "+jobsArray.length;
					res.redirect('/')
					//res.send(jobsArray);
				});
			}else  {
				var cursor = db.collection('jobs').find(jobs);
				cursor.forEach(function(doc,err){
				if(err){
					console.log(err);
				} else {
					jobsArray.push(doc);
				}
				},function(){
					searchresults = "Search results "+jobsArray.length;
					res.redirect('/')
						//res.send(jobsArray);
				});
			}	
			
		}
	});

});

app.post('/startProjects',upload.single('image'),function(req,res){
	var myfile = req.file;
	var project = {
		title:req.body.title,
		category:req.body.category,
		deadline:req.body.deadline,
		funds:req.body.funds,
		phonenumber:req.body.phonenumber,
		address:req.body.address,
		city:req.body.city,
		country:req.body.country,
		zipcode:req.body.zipcode,
		description:req.body.description,
		about:req.body.about,
		status:'pending',
		fundscollected:0,
		image:JSON.stringify(req.file),
	};
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		} else {
			db.collection('projects').insert(project,function(err,result){
				if(err){
					console.log('error');
				} else {
					console.log(req.files);
					res.render('successProject',{a,b,c,d,e,f})
				}
			});
		}
	});

});

app.post('/addSuccessStories',upload.single('image'),function(req,res){
	a=""
	b="active"
	c=""
	d=""
	e=""
	f=""
	var story = {
		title:req.body.title,
		description:req.body.description,
		about:req.body.about
	};
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		} else {
			db.collection('stories').insert(story,function(err,result){
				if(err){
					console.log('error');
				} else {
					console.log("req.files");
					res.render('sucessStories',{a,b,c,d,e,f})
				}
			});
		}
	});

});

app.post('/login',function(req,res){
	var login = {email:req.body.username,
		password : req.body.password
	};
	if (req.body.username == "admin@yourcontribution.com" && req.body.password == "admin"){
		res.redirect('/admin')
	} else {

	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		}
		else{
			var cursor = db.collection('users').find(login);
			cursor.forEach(function(doc,err){
				if (err) {
					console.log(err);
				} else{

					userrole.push(doc);
				}
			},function(){
				db.collection('users').count(login,function(err,count){
					
					if (count != 0){
						res.redirect('/userHome?category=arts')
					} else {
						console.log(count);
						message = "username and password is wrong";

						res.redirect('/login');
					}
				});
			});
				
		}

	});
}

});
app.post('/register',function(req,res){
	var newUser = {
	username: req.body.username,
	password: req.body.password,
	email: req.body.email,
	role: "user"
	};
	mongoClient.connect(url,function(err,db){
		if (err){
			 console.error('Error occured in database');
			 res.send("Error in connection");
			
		} else{
			console.log('Connection established '+ url);
			db.collection('users').count({email:newUser.email},function(err,count){
			if (err){console.log(err);}
			else{ 
					var number = count;
					if (count == 0){
				
						db.collection('users').insert(newUser,function(err,result){
						if (err){
							console.log(err);
						} else {
							
						
							console.log('Item Inserted');
							message="You are registered with "+newUser.email+" successfully";
							 f="active";
					res.render('success',{message,a,b,c,d,e,f});
					message="";
						
						}
						db.close();
						});
					} else {
						alreadyMessage="Email already exists";
						res.redirect('/register')
					}
				}
			
		
			});
			
		}
	});
	
	
});

app.post('/description',function(req,res){
	b = "active";
	c = "";
	a = "";
	d = "";
	e = "";
	f = "";
	fund = req.body.fund;
	res.render('confirmfunding',{fund,a,b,c,d,e,f})
});

app.post('/forgotpassword',function(req,res){

	var forgotMail = { "email": req.body.forgotmail};
	
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log('Error occured');
		} 
		else {
			var cursor = db.collection('users').find(forgotMail);
			cursor.forEach(function(doc,err){
				if (err){
					console.log(cursor);
					console.log(err);
				} else {
					console.log("1");
					resultArray.push(doc);
					
				}
			},function(){
				if (resultArray.length == 0) {
					message = "Email doesn't exist";
					res.redirect('/forgotpassword');
				} else {

					message = "The password is sent to your email address";
					e="active";
					res.render('success',{message,a,b,c,d,e,f});
					message = "";
				}
				//res.send("Recieved data");
				db.close();
			});
			
			
		
		}
	});
});

app.listen(3000);
console.log('Running on port 3000');

