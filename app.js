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

app.get("/user",  isLoggedIn , async (req, res) => {
    const user1 = await userModel.findOne({
        username: req.session.passport.user   // req.session.passport.user stores all the  info about the logged in user
    })
    console.log(user1)
    // .populate("posts")  //To give details about post posted by an user 
    res.render("user", {user1});
});

app.get("/change", (req,res)=>{
    res.send("chaning time slot")
})

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

    const getUserList = async ()=>{
        try{
            let users = await userModel.find()
            let len = users.length
            
            await userModel.updateMany({serialNumer: { $gt: 0 , $lte: len/4 }}, { $set: { slot: '1' } })
            await userModel.updateMany({serialNumer: { $gt: len/4 , $lte: len/2 }}, { $set: { slot: '2' } })
            await userModel.updateMany({serialNumer: { $gt: len/2 , $lte: len*3/4 }}, { $set: { slot: '3' } })
            await userModel.updateMany({serialNumer: { $gt: len*3/4 , $lte: len }}, { $set: { slot: '4' } })
            // const updatedUser = await userModel.find()
        //    console.log(updatedUser)
        }catch(e){
            throw new Error(e);
        }
    }
    
    
    userModel.register(userData, req.body.password)
    .then(function (){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/login")


            // Fetch all documents
            userModel.find({})
            .then(users => {
                // Iterate through each document and update the serial number
                users.forEach((user, index) => {
                    user.serialNumer = index + 1; // Setting serial number
                    user.save() // Save the updated document
                        .then(() => {
                            // console.log(`Updated serial number for ${user.fullname}`);
                            // console.log(user.serialNumer)
                            getUserList();
                        })
                        .catch(error => {
                            console.error('Error updating serial number:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            }); 
        })
    })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}