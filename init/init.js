const mongoose = require("mongoose")
const initData = require("./smpleData")
const User = require("../models/user.js")



main()
.then((res)=>{
    console.log("done")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/motoev")
}


const initDB = async ()=>{
    await User.deleteMany({})
    await User.insertMany(initData.data) 
    console.log("all data pushed")
}

initDB();