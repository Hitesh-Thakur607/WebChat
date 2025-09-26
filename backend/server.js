// const req = require("express/lib/request");
const isauthenticated =require("./middleware/authentication.js");
const dotenv = require("dotenv");
const messageRoutes = require("/home/hitesh-thakur/Documents/VSCode/Webchat/backend/routes/messages.js");
const cors = require("cors");
const connectdb = require("./data/data.js");
dotenv.config();

const express=require("express");
const cookieParser = require("cookie-parser");
const app=express();
// dotenv.config();
connectdb();  // Connect to MongoDB
app.use(cors({
    origin: process.env.frontend_url,  // Use the environment variable for the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const userRoutes = require("./routes/user.js");
const chatRoutes = require("./routes/chatRoutes.js");
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/chats", isauthenticated, (req, res) => {
    res.send("This is the chat route");
}); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  