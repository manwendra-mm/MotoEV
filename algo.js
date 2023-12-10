const mongoose = require("mongoose")
// const initData = require("./smpleData")
const User = require("./models/user.js")

main()
.then((res)=>{
    console.log("done")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/motoev")
}

const getUserList = async ()=>{
    try{
        const users = await User.find()
        console.log(users.length)
    }catch(e){
        throw new Error(e);
    }
}

getUserList();
