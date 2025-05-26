import Message from "../models/message.js";
import User from "../models/user.model.js";

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
    } catch (error) {
        
    }
}

const sendMessages= async (req ,res) => {
    try {
        const {message,image}=req.body;
        const {id:receiverId}=req.params;
        const loggingUserId=req.user._id;

        let imgUrl;
        if(image){
            const uploadImageRes = await cloudinary.uploader.upload(image)
            imgUrl=uploadImageRes.secure_url;
        }
        const newMessage= await Message.create({
            message,
            image:imgUrl,
            senderId:loggingUserId,
            receiverId
        })
        await newMessage.save();
        res.status(200).json({message:"Message sent successfully",data:newMessage})
    } catch (error) {
        req.status(500).json({message:"Internal server error"})
        console.error("Error in sendMessages",e.message )
    }
}



export {getUserFromIcon,getMessages,sendMessages}