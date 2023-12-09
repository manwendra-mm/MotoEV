const express = require("express");
const app =  express();
const port = 3000;
app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
// database connection 

const mongoose = require("mongoose");

main()
.then((res)=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/motoev")
}

const expressSession = require("express-session")
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret: "you are my son"
}))




const userModel = require("./models/user")
const path = require("path")
const userRouter = require('./models/user');

// for auth error message we use flash 
const flash = require("connect-flash")
app.use(flash());



// to authenticate users we take help of middleware called passport & we use this two line to login user
const passport = require("passport")
const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()))


app.use('/users', userRouter);
app.use(passport.initialize());  
app.use(passport.session()); // using password to create session
passport.serializeUser(userRouter.serializeUser());
passport.deserializeUser(userRouter.deserializeUser());



app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// Routes 

app.get("/", (req,res) => {
    res.render("index.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.flash("error") })
})
app.get("/signup", (req, res)=>{
    res.render("signup.ejs")
})

app.get("/profile", isLoggedIn , async (req, res) => {
    const user1 = await userModel.findOne({
        username: req.session.passport.user   // req.session.passport.user stores all the  info about the logged in user
    })
    console.log(user1)
    // .populate("posts")  //To give details about post posted by an user 
    res.render("profile", {user1});
});


app.get('/logout', function(req, res, ){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
}) ,(req, res)=>{})

// register route for geting data of user
app.post("/signup", (req,res)=>{
    let {username,email,fullname, phone, carmodel } = req.body
    const userData = new userModel({
        username: username,
        email: email,
        fullname: fullname,
        phone: phone,
        carmodel: carmodel,
    })
    userModel.register(userData, req.body.password)
    .then(function (){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/login")
        })
    })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}