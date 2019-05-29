const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const {Idea} = require('./models/Idea');
const methodOverride = require('method-override')
const app = express();

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/youjot-dev', {
        useNewUrlParser: true
    }).then(() => console.log('Mongo Connected'))
    .catch((err) => console.log(err));

//Adding templating engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Adding body parser to process the request data
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(methodOverride('_method'))

const port = 5000;


app.get("/", (req, res) => {
    const name = "Kshitiz";
    res.render('index', {
        name: name
    });
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/ideas/add", (req,res)=>{
    res.render("ideas/add");
})

app.get("/ideas/edit/:id", (req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then((idea)=>{
        res.render("ideas/edit",{idea:idea});
    })
    
})


app.get("/ideas",(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        console.log(ideas);
        res.render("ideas/ideasIndex",{ideas:ideas})
    })
   
})

app.post("/ideas",(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text:"Please add some title"});
    }
    if(!req.body.details){
        errors.push({text:'Please add details'});
    }

    if(errors.length>0){
        res.render('ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
        
    }else{
        const newUser= {
            title:req.body.title,
            details:req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            console.log("Idea addes Successfully"+idea);
            res.redirect("/ideas");
        })
    }
    
});

app.put("/ideas/:id",(req, res)=>{
    Idea.findOne(
        {_id:req.params.id}
    ).then((idea)=>{
       idea.title=req.body.title;
       idea.details=req.body.details;

       idea.save().then(idea=>{
           res.redirect("/ideas");
       })
    })
   
})

app.delete("/ideas/:id",(req, res)=>{
    console.log(req.params)
    Idea.findOne(
        {_id:req.params.id}
    ).then((idea)=>{
    //    idea.title=req.body.title;
    //    idea.details=req.body.details;
        console.log("idea->>>>>>    "+idea)
       Idea.deleteOne({_id:idea.id}).then(idea=>{
           res.redirect("/ideas");
       })
    })
  
   
})
app.listen(port, () => {
    console.log(`Server up and running at port: ${port}`);
})