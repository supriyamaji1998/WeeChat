import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectProfile=async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unautorized - Token Not Found!"})
        }
        const decode= jwt.verify(token,process.env.JWT_TOKEN_SECRET)
        if(!decode){
            return res.status(401).json({message:"Unautorized - Token Not Valid!"})
        }
        const user= await User.findById(decode.userId).select("-password")
        
        if(!user){
            return res.status(401).json({message:"User Not Found!!!"})
        }
    
        req.user=user
    
        next()
        
    } catch (error) {
        console.error("Error to get user information",e.message )
        res.status(500).json({message:"Internal server error"})
    }

}

export default protectProfile;