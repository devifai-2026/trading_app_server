import express from "express";
import { registerOtp, loginOtp } from "../../controllers/user/otpController.js";

const router = express.Router();

// Register OTP (request OTP by sending only email, verify by sending email + otp)
router.post("/register", registerOtp);

// Login OTP (request OTP by sending only email, verify by sending email + otp)
router.post("/login", loginOtp);

export default router;
