import Message from "../models/message.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudnary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
const getUserFromIcon= async (req ,res) => {


    try{
        const loggingUserId = req.user._id;
        const filterUserId= await User.find({ _id:{$ne:loggingUserId} }).select("-password");

        res.status(200).json({message:"User data fetched successfully",data:filterUserId})
    }catch(e){
        res.status(500).json({message:"Internal server error"})
        console.error("Error in getUserFromIcon",e.message )

    }

};

const getMessages= async (req ,res) => {
    try {
        const {id:userToChatId}=req.params;
        const loggingUserId=req.user._id;
        const messages=await Message.find({
            $or: [
                { senderId :loggingUserId, receiverId:userToChatId },
                { senderId:userToChatId , receiverId:loggingUserId }
            ]
        })
    res.status(200).json(messages);

    } catch (error) {
        
    }
}

const sendMessages= async (req ,res) => {
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const loggingUserId=req.user._id;

        let imgUrl;
        if(image){
            const uploadImageRes = await cloudinary.uploader.upload(image)
            imgUrl=uploadImageRes.secure_url;
        }
        const newMessage= await Message.create({
            message:text,
            image:imgUrl,
            senderId:loggingUserId,
            receiverId
        })
        await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
        res.status(200).json({message:"Message sent successfully",data:newMessage})
    } catch (error) {
        console.error("Error in sendMessages",error.message )
                res.status(500).json({message:"Internal server error"})
    }
}



export {getUserFromIcon,getMessages,sendMessages}