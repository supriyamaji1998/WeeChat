import express from "express"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // you can increase this if needed
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser() )
app.use(cors({
    origin:"http://localhost:5173", // Adjust this to your frontend URL
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/messages",messageRouter)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(5001,()=>{
    console.log("server is running in PORT NO : 5001")
    connectDB()
})