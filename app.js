var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


var app = express();
 
 mongoose.connect("mongodb://localhost:27017/restful_blog-app",{useNewUrlParser:true});
 app.set("view engine","ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));  
 app.use(methodOverride("_method"));
 app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{
				type:Date, default:Date.now
			}

});

var Blog = mongoose.model("Blog",blogSchema);

/*Blog.create({
	title:"Test blog",
	image:"https://images.unsplash.com/photo-1533921180317-f3cf9f2a9388?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2c547d61fc0a88464c2f190ba06b8bef&auto=format&fit=crop&w=633&q=80",
	body:"Hello , this is the testing blog",

});*/



app.get("/",function(req,res){
	res.redirect("/blogs");
});
//RESTFUL ROUTES
//INDEX

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
 app.post("/blogs",function(req,res){
 	//create blog
 	req.body.blog.body = req.sanitize(req.body.blog.body);
 	Blog.create(req.body.blog,function(err,newBlog){
 		if(err)
 		{
 			console.log(err);

 		}
 		else{
 			res.redirect("/blogs");
 		}
 	});
 });

 //Show route

 app.get("/blogs/:id",function(req,res){
 	Blog.findById(req.params.id,function(err,foundblog){
 		if(err)
 		{
 			console.log(err);
 		}else{
 			res.render("show",{blog:foundblog});
 		}
 	});
 });


//EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
}); 

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
		{
			res.redirect("/blog");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			console.log(err);
		}else
		res.redirect("/blogs");
	});
});







 app.listen(3000,function(){
 	console.log("Server is running");
 });