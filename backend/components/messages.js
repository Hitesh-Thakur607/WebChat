const User = require("../modals/user.js");
const Message = require("../modals/message.js");
const Chat = require("../modals/chatmodel.js");
const sendMessage=async (req, res)=>{
    const { chatId, content } = req.body;
    
    if (!chatId || !content) {
        console.log("Invalid data passed into request");
        return res.status(400).json({ error: "chatId and content are required" });
    }
    var newmessage={
        sender: req.user._id,
        content: content,
        chat: chatId,  
    }
    try{
        var message=await Message.create(newmessage);
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{ path: "chat.users", select: "name pic email" });
    
    await Chat.findByIdAndUpdate(chatId,{latestMessage:message});
    return res.status(200).json(message);
    } catch(error){
        console.log("Error while sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
const allMessages=async (req, res)=>{
    try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat");
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error while fetching messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
module.exports={sendMessage, allMessages};