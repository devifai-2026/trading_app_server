import express from "express";
import cors from "cors";
import authRoutes from "./routes/user/authRoutes.js"; // ✅ add this import
import otpRoutes from "./routes/user/otpRoutes.js";

const app = express();

// Middleware configuration
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, origin);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// ✅ Mount routes here
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

// Health check route
app.get("/trading", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Trading endpoint is active",
    timestamp: new Date().toISOString(),
  });
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome To Trading API",
    version: "1.0.0",
    status: "active",
    timestamp: new Date().toISOString(),
  });
});

export default app;
