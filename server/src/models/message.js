import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
   "receiverId": {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
   },
   "senderId": {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
   },
   "message": {
       type: String,
       required: true
   },
   "isRead": {
       type: Boolean,
       default: false
   },
   "isDeleted": {
       type: Boolean,
       default: false
   },
   "isDeletedBySender": {
       type: Boolean,
       default: false
   },
   "isDeletedByReceiver": {
       type: Boolean,
       default: false
   },
   "image": {
       type: String,
       default: null
   }
}, { timestamps: true })

const Message= mongoose.model("Message", messageSchema);

export default Message