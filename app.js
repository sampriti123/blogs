var express=require('express')
var mongoose=require('mongoose')
var bodyParser=require('body-parser')
var methodOverride=require('method-override')
var app=express()
var port=process.env.Port || 3000
mongoose.connect("mongodb+srv://sampoo:shampoo999@cluster0.jhylp.mongodb.net/<dbname>?retryWrites=true&w=majority");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create(
//      {
//         title: "camp", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//          body: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, blog){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED Blog: ");
//           console.log(blog);
//       }
//     });
app.get("/", function(req, res){
    res.redirect("/blogs"); 
 });
app.get('/blogs',(req,res)=>
{
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
           res.render("index", {blogs: blogs}); 
        }
    });
})
app.post('/blogs',(req,res)=>
{
    Blog.create(req.body.blog,(err,newBlog)=>
    {
        if(err)
        {
            res.render("new")
        }else{
            res.redirect("/blogs")
        }
    })
})

app.get('/blogs/new',(req,res)=>
{
    res.render("new")
})
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
 });

 app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})


 app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
 });

app.listen('port',()=>
{
    console.log('port has been started')
})