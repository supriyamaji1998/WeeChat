import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    profilePic: {
        type: String,
        default:"https://www.gravatar.com/avatar/?d=mp"
    }
},{ timestamps: true })

const User= mongoose.model("User",userSchema)

export default User;