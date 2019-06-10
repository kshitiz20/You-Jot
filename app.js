const express = require('express');
const exphbs = require('express-handlebars');
var handlebars  = require('./helpers/handlebars.js')(exphbs);
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const {Idea} = require('./models/Idea');
const methodOverride = require('method-override')
const session= require('express-session');
const flash= require('connect-flash');
const app = express();
const ideas= require('./routes/ideas');
const users= require("./routes/users");
const todos= require("./routes/todos")
const path= require("path");
const passport= require('passport');
const {strategy}=require("./config/passport")
const {serialize}=require("./config/passport")
const {deserialize}=require("./config/passport")
const db= require('./config/db')
//Passing passport to strategy
strategy(passport);
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
        useNewUrlParser: true
    }).then(() => console.log('Mongo Connected'))
    .catch((err) => console.log(err));

//Adding templating engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Adding body parser to process the request data
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
     }))

app.use(flash());

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user= req.user||null
    next();
})


app.get("/", (req, res) => {
    const ideas = "Ideas";
    res.render('index', {
        name: ideas
    });
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.use('/ideas',ideas)
app.use('/todos', todos)
app.use("/users",users);



const port =process.env.PORT|| 5000;


app.listen(port, () => {
    console.log(`Server up and running at port: ${port}`);
})