import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//REGISTER USER LOGIC
export const registerUser = async (req, res)=>{

    const {name, email, password} = req.body;

    if(!name || !email || !password) return res.status(422).json({
        success: false,
        message: "Missing user details"
    })

    //adding password length validation
    if(password.length<6){
        return res.status(422).json({
            success: false,
            message: "Password must be atleast 6 characters"
        });
    }

    try {
        const existingUser = await userModel.findOne({email})

        //adding validation for already existing user
        if(existingUser) return res.status(409).json({
            success: false,
            message: "A user with this email already exists"
        })

        const hashedPassword = await bcrypt.hash(password, 10)

        //creating a new user in the database
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        //Creating a token which wil be used during our authentication process
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '3d'})

        //setting up with cookie which will be sent as a response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        //sending data to the frontend
        return res.status(201).json({
            success: true,
            message: "User has ben created successfully",
            user: {id: user._id, name: user.name, email: user.email}
        })
    } catch (err) {
        return res.status(500).json({success: false, message: err.message})
    }
}

//LOGIN USER LOGIC
export const loginUser = async (req, res)=>{

    const {name, email} = req.body;
    
}