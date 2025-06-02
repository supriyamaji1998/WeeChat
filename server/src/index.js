import express from "express"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const app=express();
app.use(express.json());
app.use(cookieParser() )
app.use(cors({
    origin:"http://localhost:5173", // Adjust this to your frontend URL
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter)
app.listen(5001,()=>{
    console.log("server is running in PORT NO : 5001")
    connectDB()
})