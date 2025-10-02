const express = require('express');
const isauthenticated = require("../middleware/authentication.js");
const {login, register, me,allUsers,logout,verifyEmail} = require("../components/user.js");
const router = express.Router();
router.get('/me', isauthenticated, me);
router.post("/login", login);
router.post("/register", register);
router.get("/users", isauthenticated, allUsers);
router.post("/verify", verifyEmail);
router.post("/logout", isauthenticated, logout);

module.exports = router;