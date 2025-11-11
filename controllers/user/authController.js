import bcrypt from "bcryptjs";
import User from "../../models/UserModel/UserModel.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import handleMongoErrors from "../../utils/mongooseError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js"
//  REGISTER / SIGNUP

export const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, email, password, confirmPassword } = req.body;

  if (!name || !phone || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(false, "All fields are required"));
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(false, "Passwords do not match"));
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res
      .status(409)
      .json(new ApiResponse(false, "User with this email already exists"));
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    return res
      .status(409)
      .json(
        new ApiResponse(false, "User with this phone number already exists")
      );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    phone,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: newUser,
        tokens: { accessToken, refreshToken },
      },
      "User registered successfully"
    )
  );
});

// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
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
      .json(new ApiResponse(401, null, "Invalid email. Please enter correct email"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid password. Please enter correct password"));
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
});


export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(new ApiResponse(false, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, "User not found with this email"));
    }

    // ✅ Fixed OTP (temporary)
    const otp = "123456";

    // In real use case: send OTP via mail/SMS
    return res.status(200).json(
      new ApiResponse(
        true,
        { email: user.email, otp },
        "OTP generated successfully"
      )
    );
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return handleMongoErrors(error, res);
  }
});


// ✅ 2. Reset Password (verify fixed OTP)
export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, "All fields are required"));
    }

    if (otp !== "123456") {
      return res
        .status(400)
        .json(new ApiResponse(false, "Invalid or expired OTP"));
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, "Passwords do not match"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, "User Email not found"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(true, null, "Password reset successfully"));
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return handleMongoErrors(error, res);
  }
});


// ✅ 3. Change Password (logged-in user only)
export const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, "All fields are required"));
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json(new ApiResponse(false, "Passwords do not match"));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, "User not found"));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiResponse(false, "Old password is incorrect"));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(true, null, "Password changed successfully"));
  } catch (error) {
    console.error("Error in changePassword:", error);
    return handleMongoErrors(error, res);
  }
});
