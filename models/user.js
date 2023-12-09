const plm = require("passport-local-mongoose")
// connecting DB 

const mongoose = require("mongoose");

main().then((res)=>{
    console.log("connection secured")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/motoev")
}

// creating schema for user

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required : true,
    },
    username: {
        type: String,
        required : true,
        unique : true,
    },
    password: {
        type: String,
    },
    dp: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    carmodel: {
        type: String,
        required: true
    }
});
userSchema.plugin(plm);
// Creating model using defined Schema and exporting

module.exports = mongoose.model('User', userSchema);



