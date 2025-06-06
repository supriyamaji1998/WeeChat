import express from "express";
import {signup , login ,logout,updateProfile,checkAuth,verifyEmail} from "../controllers/auth.controller.js"
import protectProfile from "../middleware/auth.middlewire.js"
const router= express.Router()

router.post("/signup",signup)
router.post("/verify-email",verifyEmail) // Assuming this is for email verificatio
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",protectProfile,updateProfile)
router.get("/checkAuth",protectProfile,checkAuth)
export default router;
