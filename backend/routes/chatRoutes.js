const express=require('express');
const isauthenticated=require('/home/hitesh-thakur/Documents/VSCode/Webchat/backend/middleware/authentication.js');
// const { createIndexes } = require('../modals/user');
const router=express.Router();
const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addtoGroup} =  require('/home/hitesh-thakur/Documents/VSCode/Webchat/backend/components/chats.js')
router.post("/",isauthenticated,accessChat);
router.get("/",isauthenticated,fetchChats);
router.post("/group",isauthenticated,createGroupChat);
router.put("/rename",isauthenticated,renameGroup);
router.put("/groupremove",isauthenticated,removeFromGroup);
router.put("/groupadd",isauthenticated,addtoGroup);
module.exports=router;