import User from "../models/user.model.js";
import EmailVerification from "../models/email.verification.model.js";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudnary.js";
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer";
import sharp from "sharp";
const signup = async (req,res)=> {
    const {name,email,password}=req.body;
    try{

        if(!name || !email || !password){
            return res.status(400).json({message:'All values are required'});
        }
        if(password.length<6){
            return res.status(400).json({message:'Password must be at least 6 characters'});
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:'Emailid is already exists'})
        const salt= await bcrypt.genSalt(10)
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

const verifyEmail = async (req, res) => {
    const { name,email,password } = req.body;   
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All values are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email is already registered' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
            html: `<p>Hello ${name},</p>
                   <p>Your OTP for WeeChat signup is: <strong>${otp}</strong></p>
                   <p>Please use this OTP to complete your registration.</p>
                   <p>Thank you!</p>`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
                    return console.log('Error:', error);
                }
                 console.log('Email sent:', info.response);
        });
        const salt= await bcrypt.genSalt(10)
        const hashedotp = await bcrypt.hash(otp,salt)
        const newOtpRecord = new EmailVerification({
            email,
            otp:hashedotp
        })

        if(newOtpRecord) {
            await newOtpRecord.save()
            res.status(201).json({
                message: 'OTP sent to your email. Please verify to complete signup.',
                otp: newOtpRecord.otp,
                email: newOtpRecord.email
            })
        }else{
         res.status(400).json({message:'Unable to send OTP, please try again later'});
        }

    }catch (error) {
        console.error("Error in verify email controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }  
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;   
    try {
        if ( !email) {
            return res.status(400).json({ message: 'Email is required...' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User is not regaistered with this email.' });

        // return res.status(200).json({ message: 'User is already registered with this email.',user});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
            subject: "Your OTP for reset password",
            html: `<p>Hello ${user.name},</p>
                   <p>Your OTP for reset password is: <strong>${otp}</strong></p>
                   <p>Please use this OTP to reset your password.</p>
                   <p>Thank you!</p>`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
                    return console.log('Error:', error);
                }
                 console.log('Email sent:', info.response);
        });
        const salt= await bcrypt.genSalt(10)
        const hashedotp = await bcrypt.hash(otp,salt)
        const newOtpRecord = new EmailVerification({
            email,
            otp:hashedotp
        })

        if(newOtpRecord) {
            await newOtpRecord.save()
            res.status(201).json({
                message: 'OTP sent to your email. Please verify to reset password...',
                otp: newOtpRecord.otp,
                email: newOtpRecord.email
            })
        }else{
         res.status(400).json({message:'Unable to send OTP, please try again later'});
        }

    }catch (error) {
        console.error("Error in verify email controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }  
}

const reSetNewPass = async (req, res) => {
    const { email , newPassword } = req.body;
    console.log("Reset Password Request:", req.body);
    try {
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'All values are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }           
        const user = await User.find({ email });
        if (!user) return res.status(400).json({ message: 'User is not registered with this email.' });   
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);    
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(400).json({ message: 'Unable to reset password, please try again later.' });
        }   
        return res.status(200).json(updatedUser)    
    } catch (error) {
        console.error("Error in reSetNewPass controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
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
        const {profilePic}=req.body.authUser;
        console.log("Update Profile Request:", profilePic);
        const userId= req.user._id;

        if(!profilePic){
            return res.status(401).json({message:'ProfilePic is required'});
        }

        // Decode base64 image
        const matches = profilePic.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
            return res.status(400).json({ message: "Invalid image format" });
        }
        const buffer = Buffer.from(matches[2], "base64");

        // Compress image to ~300KB
        let compressedBuffer = await sharp(buffer)
            .jpeg({ quality: 70 }) // adjust quality as needed
            .toBuffer();

        // If still larger than 300KB, reduce quality further
        let quality = 70;
        while (compressedBuffer.length > 150 * 480 && quality > 30) {
            quality -= 10;
            compressedBuffer = await sharp(buffer)
            .jpeg({ quality })
            .toBuffer();
        }

        // Convert back to base64 for cloudinary upload
        const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;


        const uploadPfPic = await cloudinary.uploader.upload(compressedBase64)
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

export {signup , login ,logout,updateProfile, checkAuth, verifyEmail,forgetPassword,reSetNewPass};