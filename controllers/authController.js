import bcrypt from "bcryptjs";
import User from '../models/UserModel/UserModel.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'
import handleMongoErrors from "../utils/mongooseError.js";
import ApiResponse from "../utils/ApiResponse.js";


//  REGISTER / SIGNUP

export const registerUser = async(req,res)=>{
    try {
          const { name, phone, email, password, confirmPassword } = req.body;
          if(!name || !phone || !email || !password || !confirmPassword) {
            return res
            .status(400)
            .json(new ApiResponse(false, "All fields are required"));
          }

          if(password !== confirmPassword) {
            return res
            .status(400)
            .json(new ApiResponse(false, "Passwords do not match"));
          }

          const existingUser  = await User.findOne({ $or :[{email}, {phone}]});
          if(existingUser){
            return res
            .status(409)
            .json(new ApiResponse(false, "User with this email or phone already exists"));
          }
         const hashedPassword = await bcrypt.hash(password,10)

         const newUser = new User ({
            name,
            phone,
            email,
            password: hashedPassword
         })
         await newUser.save();
       const accessToken = generateAccessToken(newUser._id);
       const refreshToken = generateRefreshToken(newUser._id);

         return res.status(201).json(
            new ApiResponse(201,{
                user: newUser,
                tokens: {accessToken,refreshToken},

            },"User registered successfully")
         )
        
    } catch (error) {
        console.error("error in registerUser:", error);
        return handleMongoErrors(error,res)
    }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email and password are required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid email or password"));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.lastLoginTime = new Date();
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
          },
          tokens: { accessToken, refreshToken },
        },
        "Login successful"
      )
    );
  } catch (error) {
    console.log("Error in loginUser:", error);
    return handleMongoErrors(error, res);
  }
};

