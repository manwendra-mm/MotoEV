const express = require("express");

const app =  express();

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("index.ejs");
})

app.get("/login", (req, res)=>{
    res.render("login.ejs")
})
app.get("/signup", (req, res)=>{
    res.render("signup.ejs")
})

app.get("/profile", (req,res)=>{
    res.render("profile.ejs")
})

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
