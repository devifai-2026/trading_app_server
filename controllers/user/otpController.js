import User from "../../models/UserModel/UserModel.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import ApiResponse from "../../utils/ApiResponse.js";

const FIXED_OTP = "123456"; // For testing only

// ✅ Register OTP controller (request + verify)
export const registerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(400, null, "Email is required"));
    }

    let user = await User.findOne({ email });

    // If otp not provided → send OTP
    if (!otp) {
      if (!user) {
        user = new User({ email, name: "Temp User" });
        await user.save();
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          { email, otp: FIXED_OTP },
          `OTP sent successfully. (For testing OTP is ${FIXED_OTP})`
        )
      );
    }

    // If OTP provided → verify
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    if (otp !== FIXED_OTP) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
    }

    // ✅ OTP verified → return JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        { user: { id: user._id, email: user.email }, tokens: { accessToken, refreshToken } },
        "OTP verified successfully"
      )
    );
  } catch (error) {
    console.error("Error in registerOtp:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// ✅ Login OTP controller (request + verify)
export const loginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(400, null, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(new ApiResponse(404, null, "User not found"));

    // If OTP not provided → send OTP
    if (!otp) {
      return res.status(200).json(
        new ApiResponse(
          200,
          { email, otp: FIXED_OTP },
          `Login OTP sent successfully. (For testing OTP is ${FIXED_OTP})`
        )
      );
    }

    // If OTP provided → verify
    if (otp !== FIXED_OTP) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
    }

    // ✅ OTP verified → return JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.lastLoginTime = new Date();
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        { user: { id: user._id, email: user.email }, tokens: { accessToken, refreshToken } },
        "Login OTP verified successfully"
      )
    );
  } catch (error) {
    console.error("Error in loginOtp:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};
