import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";

import userAuth from '../middlewares/userAuth.js'

const authRouter = express.Router();

// auth routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);

export default authRouter;