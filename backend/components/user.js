const User = require('../modals/user.js');
const sendcookie = require('../utils/cookie.js');  
const tempUsers = {}; 
let resend = null;
if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
} else {
    console.error('Warning: RESEND_API_KEY not found in environment variables');
}

const login = async (req, res) => {
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
        
        const {name, email, password, picture} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: "Name, email, and password are required"});
        }
        
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
           return res.status(400).json({message: "User already exists"});
        } else {
            const Token = Math.floor(100000 + Math.random() * 900000);

            // Check if Resend is initialized
            if (!resend) {
                console.error("Resend not initialized - API key missing");
                return res.status(500).json({ message: "Email service not configured" });
            }

            // Send OTP using Resend
            try {
                const { data, error } = await resend.emails.send({
                   from: 'noreply@yappnet.me',
                    to: [email],
                    subject: 'Verify Your Email - YapNet',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #333; text-align: center;">Welcome to YapNet!</h2>
                            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                                <h3 style="color: #555;">Email Verification Code</h3>
                                <div style="background-color: #007bff; color: white; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 5px; letter-spacing: 2px;">
                                    ${Token}
                                </div>
                                <p style="margin-top: 15px; color: #666;">
                                    Enter this code to verify your email address and complete your registration.
                                </p>
                                <p style="color: #999; font-size: 12px;">
                                    This code will expire in 10 minutes.
                                </p>
                            </div>
                            <p style="text-align: center; color: #666; margin-top: 20px;">
                                If you didn't request this verification, please ignore this email.
                            </p>
                        </div>
                    `,
                    text: `Your YapNet verification code is: ${Token}. Enter this code to verify your email address.`
                });

                if (error) {
                    console.error("Resend error:", error);
                    return res.status(500).json({ message: "Failed to send verification email" });
                }

                // Store in temp storage
                tempUsers[email] = { name, password, Token, picture };
                console.log("OTP sent:", tempUsers[email].Token);
                
                res.status(200).json({ 
                    message: "Verification code sent to your email. Please check your inbox.",
                    emailSent: true 
                });

            } catch (error) {
                console.error("Error sending OTP:", error);
                res.status(500).json({ message: "Failed to send verification email" });
            }
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
    const { email, token } = req.body;
  
    const tempUser = tempUsers[email];
            console.log(tempUser.Token);
        console.log(tempUser.email);
    if (!tempUser) return res.status(400).json({ message: "No OTP requested for this email" });
  
    if (tempUser.Token == token) {

        await User.create({ name: tempUser.name, email, password: tempUser.password, isVerified: true, picture: tempUser.picture });
        // const savedUser = await newUser.save();
      delete tempUsers[email]; // Clean up
      return res.status(200).json({ message: "Email verified and user registered" });
    } else {
      return res.status(400).json({ message: "Invalid verification token" });
    }
  };
const allUsers = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};
        
        const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
        res.send(users);
    } catch (error) {
        console.error("Search users error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const logout = (req, res) => {
    const user = req.user;
    if (!user) {
        console.log("User not logged in");
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