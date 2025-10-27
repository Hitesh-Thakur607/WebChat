const mongoose = require("mongoose");
const connectdb=()=>{
    mongoose.connect("mongodb+srv://hitesht130:102030@cluster0.kipkqzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
        dbName:"webchat",
    })
    .then((c)=>console.log("MongoDB connected",c.connection.host))
    .catch((err)=>console.error("MongoDB connection error:", err));
}
module.exports=connectdb;