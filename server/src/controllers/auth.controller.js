import User from "../models/user.model.js";
import EmailVerification from "../models/email.verification.model.js";
import generateToken from "../lib/utils.js";

import bcrypt from "bcryptjs"
import nodemailer from "nodemailer";
const signup = async (req,res)=> {
    const {name,email,password}=req.body;
    try{

        if(!name || !email || !password){
            return res.status(400).json({message:'All values are required'});
        }
        // Check if email is already pending verification
        const existingOTP = await EmailVerification.findOne({ email, isVerified: false });
        if (existingOTP) {

            return res.status(400).json({ message: 'Please verify your email with the OTP sent previously.' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt= await bcrypt.genSalt(10)

        // Store OTP and user data temporarily (e.g., in a separate collection or cache)
        // For demonstration, let's assume you have a PendingUser model
        // await PendingUser.create({ name, email, password, otp, createdAt: new Date() });

        // Send OTP to user's email (implement your email sending logic here)
        // await sendOTPEmail(email, otp);
        // Example using nodemailer

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: "majisupriya198@gmail.com",
            pass: "rywc sxck nsvo yygd",
            },
        });

        const mailOptions = {
            from: "majisupriya198@gmail.com",
            to: email,
            subject: "Your OTP for WeeChat Signup",
            text: `Your OTP is: ${otp}`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
                    return console.log('Error:', error);
                }
                 console.log('Email sent:', info.response);
        });
        return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
        
        if(password.length<6){
            return res.status(400).json({message:'Password must be at least 6 characters'});
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:'Emailid is already exists'})
        const hashedpassword = await bcrypt.hash(password,salt)
        const newUser= new User({
            email,
            name,
            password:hashedpassword
        })

        if(newUser) {
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
            // message:'New user has been created',
            _id:newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic

            })
        }else{
         res.status(400).json({message:'Invalid User data'});
        }

    } catch(e){
        console.error("Error in signup controller",e.message )
        res.status(500).json({message:"Internal server error"})
    }
}

const login = async (req,res)=> {
    const {email,password}=req.body;
    try{

        if(!email || !password){
            return res.status(400).json({message:'All values are required'});
        }

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:'Invalid credentials!'})
        const isCorrectPass= await bcrypt.compare(password , user.password)

        if(!isCorrectPass){
            return res.status(400).json({message:'Invalid Password'});
        }
        
        generateToken(user._id,res)
        res.status(200).json({
            // message:'New user has been created',
            _id:user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic

            })

    } catch(e){
        console.error("Error in login",e.message )
        res.status(500).json({message:"Internal server error"})
    }

}

const logout= (req,res)=> {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.error("Error in log out controller",e.message )
        res.status(500).json({message:"Internal server error"})
    }
}

const updateProfile= async(req,res)=> {
    try{
        const {profilePic}=req.body;
        const userId= req.user._id;

        if(!profilePic){
            return res.status(401).json({message:'ProfilePic is required'});
        }

        const uploadPfPic = await cloudinary.uploader.upload(profilePic)
        const updateUser= await User.findByIdAndUpdate(userId,
            {
                profilePic:uploadPfPic.secure_url
            },
            {
                new:true
            }
        )
        res.status(200).json(updateUser)
    } catch(e){
        console.error("Error in update profile picture",e.message )
        res.status(500).json({message:"Internal server error"})
    }

}

const checkAuth= (req,res)=> {
    try{
        res.status(200).json(req.user)
    } catch(e){
        console.error("Error in checkIn authanticator",e.message )
        res.status(500).json({message:"Internal server error"})
    }

}

export {signup , login ,logout,updateProfile, checkAuth}