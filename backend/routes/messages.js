const e = require("cors");
const isauthenticated = require("../middleware/authentication.js");
const { sendMessage,allMessages } = require("../components/messages.js");
const express = require("express");
const router = express.Router();
router.post("/", isauthenticated, sendMessage);
router.get("/:chatId", isauthenticated, allMessages);
module.exports = router;