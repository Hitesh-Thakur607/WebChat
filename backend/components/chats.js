const Chat = require("../modals/chatmodel.js");
const User = require("../modals/user.js");

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User ID is required");
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Check if chat already exists
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        })
        .populate("users", "-password")
        .populate("latestMessage");

        // Populate latestMessage sender details
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        // If chat exists, return it
        if (isChat.length > 0) {
            return res.status(200).json({ chat: isChat[0] });
        }

        // Else create new chat
        const chatData = {
            chatName: userId,
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findOne({ _id: createdChat._id })
            .populate("users", "-password");

        res.status(200).json(fullChat);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
const fetchChats=async (req, res)=>{
    try{
        const chats =  await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
  .populate("users", "-password")
  .populate("groupAdmin", "-password")
  .populate({
    path: "latestMessage",
    populate: {
      path: "sender",
      select: "name pic email"
    }
  })
  .sort({ updatedAt: -1 });
            console.log("Chats fetched:", chats);
        res.status(200).json(chats);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const createGroupChat=async (req, res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please fill all the fields"});
    }
    var users=JSON.parse(req.body.users);
    // console.log("Token received:", req.headers.authorization);
    if(users.length<2){
        return res.status(400).send({message:"More than 2 users are required to form a group chat"});
    }
    users.push(req.user);
    const groupChat=await Chat.create({
        chatName:req.body.name,
        users:users,
        isGroupChat:true,
        groupAdmin:req.user
    });
    const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
    res.status(200).json(fullGroupChat);
}
const renameGroup = async (req,res)=>{
    const {chatId,chatName} = req.body;
    if(chatId.isAdmin!=User._id){
        return res.status(403).send({message:"Only admins can rename the group"});
    }
    const updatedChat =await Chat.findByIdAndUpdate(chatId,{chatName:chatName},{new:true})
    .populate("users","-password").populate("groupAdmin","-password");
    if(!updatedChat){
        return res.status(404).send({message:"Chat not found"});
    }
    res.json(updatedChat);
}
const addtoGroup =async (req,res)=>{
    const {userId,chatId} = req.body;
            if(chatId.isAdmin!=User._id){
        return res.status(403).send({message:"Only admins can add members to the group"});
    }
    const added= await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!added){
        return res.status(404).send({message:"Chat not found"});
    }
    res.json(added);
}
const removeFromGroup = async (req,res)=>{
    const {userId,chatId} = req.body;
            if(chatId.isAdmin!=User._id){
        return res.status(403).send({message:"Only admins can remove members from the group"});
    }
    const removed= await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true}).populate("users","-password").populate("groupAdmin","-password");
    if(!removed){
        return res.status(404).send({message:"Chat not found"});
    }
    res.json(removed);
}
module.exports = { accessChat , fetchChats , createGroupChat , renameGroup,removeFromGroup,addtoGroup };
