import express from "express";
import UserData from "../models/user.js";
import { sign } from "../utils/token.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import authenticateMiddleware from "../middleware/authenticateMiddleware.js";


const router = express.Router();

// API - 1 Register
router.post("/register", async (req, res, next) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;
    if (!userName) {
      return res
        .status(400)
        .json({ error: true, message: "Username is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Confirmpassword is required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Password not match" });
    }

    const isUser = await UserData.findOne({ userName: userName });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "Username already exist",
      });
    }

    const isEmail = await UserData.findOne({ email: email });

    if (isEmail) {
      return res.status(400).json({
        error: true,
        message: "Email already exist",
      });
    }

    // Hash password
    // console.log(password)
    const hashedPassword = await hashPassword(password);

  
    const newUser = new UserData({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = sign({
      id: newUser._id,
      userName,
      email,
      password: hashedPassword,
    });
    
    return res.status(201).json({
      data: newUser,
      accessToken: token,
      message: "Registration Successful",
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API - 2 Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const emailCheck = await UserData.findOne({ email: email });
    if (!emailCheck) {
      return res.status(401).json({ error: true, message: "Email Invalid" });
    }

    // console.log(emailCheck)

    const isMatch = await comparePassword(password, emailCheck.password);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: "Invalid Password" });
    }

    // Generate token
    const token = sign({ id: emailCheck.id });
    // delete emailCheck.password;

    res
      .status(201)
      .json({
        message: "Login successful",
        data: emailCheck,
        accessToken: token,
      });
  } catch (error) {
   
    return res.status(500).json({ error: 'Internal Server Error' });
    
  }
});


// API - 3 Get user by ID
router.get("/get-user", authenticateMiddleware, async (req, res ) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({user: user, message: "Authorization token not Found",});
      }

      return res.status(200).json({
        user: user,
        message: "User Found",
      });
     
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error ' });
    }
  });


  

export default router;