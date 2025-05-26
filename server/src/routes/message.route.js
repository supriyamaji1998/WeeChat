import express from "express";
import Message from "../models/message.js";
import {getUserFromIcon,getMessages,sendMessages} from "../controllers/message.controller.js";
import protectProfile from "../middleware/auth.middlewire.js"
import { setRandomFallback } from "bcryptjs";

const router = express.Router()

router.get("/users",protectProfile,getUserFromIcon);
router.get("/:id",protectProfile,getMessages)
router.post("/sendMessage/:id",protectProfile,sendMessages)

export default router;

