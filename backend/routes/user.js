const express = require('express');
const authMiddleware = require('/home/hitesh-thakur/Documents/VSCode/Webchat/backend/middleware/authentication.js');
const {login, register, me,allUsers,logout,verifyEmail} = require("../components/user.js");
const router = express.Router();
router.get('/me', authMiddleware, me);
router.post("/login", login);
router.post("/register", register);
router.get("/users", authMiddleware, allUsers);
router.post("/verify", verifyEmail);
router.post("/logout", authMiddleware, logout);

module.exports = router;