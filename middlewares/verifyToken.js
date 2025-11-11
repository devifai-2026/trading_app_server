import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(new ApiResponse(false, null, "Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // ✅ Attach userId properly for later use
    req.user = { _id: decoded.userId };

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res
      .status(403)
      .json(new ApiResponse(false, null, "Invalid or expired token."));
  }
};

export default verifyToken;
