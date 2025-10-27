const User = require('../modals/user.js');
const sendcookie = require('../utils/cookie.js');  
const tempUsers = {}; // Temporary storage for users
const nodemailer = require('nodemailer');
const login=async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({message: "Request body is required"});
        }
        
        const {email, password} = req.body;
        
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        
        const foundUser = await User.findOne({ email: email, password: password });
        if (foundUser) {
            sendcookie(res, foundUser, "Login successful");
            return res.status(200).json({message: "Login successful", user: foundUser});
        } else {
            return res.status(401).json({message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({message: "Request body is required"});
        }
        
        const {name, email, password,picture} = req.body;

        if (!name || !email || !password ) {
            return res.status(400).json({message: "Name, email, and password are required"});
        }
        
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
           return res.status(400).json({message: "User already exists"});
        } else {

  const Token = Math.floor(100000 + Math.random() * 900000);

  // Send OTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER ,
      pass: process.env.EMAIL_PASS ,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Library Management" <tv293435@gmail.com>`,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is ${Token}`,
      html: `<b>Your verification code is ${Token}</b>`,
    });

    // Store in temp (you can use DB with expiration if needed)
    tempUsers[email] = { name, password, Token };
    console.log(tempUsers[email].Token);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send verification email" });
  }
            
            
        //    return res.status(201).json({message: "User registered successfully", user: {name: savedUser.name, email: savedUser.email}});
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
const me = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user: req.user });
};
const verifyEmail = async (req, res) => {
    const { email, Token } = req.body;
  
    const tempUser = tempUsers[email];
            console.log(tempUser.Token);
        console.log(tempUser.email);
    if (!tempUser) return res.status(400).json({ message: "No OTP requested for this email" });
  
    if (tempUser.Token == Token) {

        await User.create({ name: tempUser.name, email, password: tempUser.password, isVerified: true, picture: tempUser.picture });
        // const savedUser = await newUser.save();
      delete tempUsers[email]; // Clean up
      return res.status(200).json({ message: "Email verified and user registered" });
    } else {
      return res.status(400).json({ message: "Invalid verification token" });
    }
  };
const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    const users= await User.find(keyword).find({_id:{$ne :req.user._id}});
    // console.log(users);
    res.send(users);
}
    //  console.log(keyword)
// });
const logout=(req,res)=>{
    const user=req.user;
    if(!user){
        console.log("not login");
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}
module.exports = {
    login,
    register,
    me,
    allUsers,
    logout,
    verifyEmail
};