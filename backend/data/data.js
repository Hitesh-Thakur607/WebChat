const mongoose = require("mongoose");
const connectdb=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"webchat",
    })
    .then((c)=>console.log("MongoDB connected",c.connection.host))
    .catch((err)=>console.error("MongoDB connection error:", err));
}
module.exports=connectdb;