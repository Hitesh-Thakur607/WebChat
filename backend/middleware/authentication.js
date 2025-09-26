const jwt = require('jsonwebtoken');
const User = require('../modals/user.js');

const isauthenticated = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }
        // console.log("Token received:", req.headers.authorization);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = isauthenticated;