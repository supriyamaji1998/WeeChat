import express from "express"
import authRouter from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const app=express();
app.use(express.json());
app.use(cookieParser() )
app.use("/api/auth",authRouter)
app.listen(5001,()=>{
    console.log("server is running in PORT NO : 5001")
    connectDB()
})