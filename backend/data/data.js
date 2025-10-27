const mongoose = require("mongoose");
const connectdb=()=>{
    mongoose.connect("mongodb+srv://hitesht130_db_user:6c2YZNS70ZhKKSW7@hitesht169.cfwn7zq.mongodb.net/?retryWrites=true&w=majority&appName=hitesht169",{
        dbName:"webchat",
    })
    .then((c)=>console.log("MongoDB connected",c.connection.host))
    .catch((err)=>console.error("MongoDB connection error:", err));
}
module.exports=connectdb;