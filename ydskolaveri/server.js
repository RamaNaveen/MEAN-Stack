var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();
var mongo = require('mongodb');
var expressLayouts = require('express-ejs-layouts');
var mongoClient = mongo.MongoClient;
app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/views/pages'));

var url = 'mongodb://localhost:27017/ydiskolaveri';
var jobsArray = []
var alreadyMessage = "";
var message = "";
var searchresults = "";
app.get('/', function(req,res){
	res.render("home",{jobsArray,searchresults});
	jobsArray = [];
	searchresults = ""
});

app.get('/register',function(req,res){
	res.render('register',{alreadyMessage});
	alreadyMessage = "";
	//res.render('/register')
});

app.get('/login',function(req,res){
	res.render("login",{message});
	message = "";
	//res.render('/register')
});

app.get('/forgotpassword',function(req,res){
	res.render("forgotpassword");
});

app.get('/FAQ',function(req,res){

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
				res.render('FAQ',{faqArray});
			});
		}
	});
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

app.post('/login',function(req,res){
	var login = {username:req.body.username,
		password : req.body.password
	};
	
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		}
		else{

			db.collection('users').count(login,function(err,count){
				if (count != 0){
					res.send("this is home page");
				} else {
					message = "username and password is wrong";

					res.redirect('/login')
				}
			});
				
		}
	});
});
app.post('/register',function(req,res){
	var newUser = {
	username: req.body.username,
	password: req.body.password,
	email: req.body.email
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
							
							 res.send("Your username is "+newUser.username+" and password is "+newUser.password+" registered email is "+newUser.email+" "+number);
						
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



app.post('/forgotpassword',function(req,res){
	var resultArray = [];
	var forgotMail = { "email": req.body.forgotmail};
	
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log('Error occured');
		} else {
			cursor = db.collection('users').find(forgotMail);
			cursor.forEach(function(doc,err){
				if (err){
					console.log(err);
				} else {
					resultArray.push(doc);
					
				}
			},function(){
				//var contents = fs.readFileSync(resultArray[0]);
				//var jsonContent = JSON.parse(contents);
				res.send(resultArray);
				//res.send("Recieved data");
				db.close();
			});
			
			
		
		}
	});
});

app.listen(3000);
console.log('Running on port 3000');

