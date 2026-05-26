import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import crypto from "crypto";

//REGISTER USER LOGIC
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(422).json({
      success: false,
      message: "Missing user details",
    });

  //adding password length validation
  if (password.length < 6) {
    return res.status(422).json({
      success: false,
      message: "Password must be atleast 6 characters",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    //adding validation for already existing user
    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new user in the database
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    //Creating a token which wil be used during our authentication process
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    //setting up with cookie which will be sent as a response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Developers Page 🎯",
      text: `Welcome to Abhishek's Page subscription. Your account has been created with email id: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    //sending data to the frontend
    return res.status(200).json({
      success: true,
      message: "User has ben created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

//LOGIN USER LOGIC
export const loginUser = async (req, res) => {
  const { password, email } = req.body;

  //adding email and name validation to avoid empty inputs
  if (!email || !password)
    return res.status(422).json({
      success: false,
      message: "Email and Password are required",
    });

  try {
    const user = await userModel.findOne({ email });

    //logic if the user doesn't exist
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    //logic for password matching
    const isMatch = await bcrypt.compare(password, user.password);

    //logic if the password is incorrect
    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    //sending data to the frontend
    return res.status(201).json({
      success: true,
      message: "Successfully logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//LOGOUT USER LOGIC
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Send verification email to the user to get verified
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `your OTP is ${otp}. Verify your account using this OTP`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Verification code has been sent on Email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify email with otp
export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  if (!userId || !otp)
    return res.status(400).json({
      success: false,
      message: "Missing details",
    });

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
