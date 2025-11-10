import express from "express";
import cors from "cors";
import errorHandler from "./middleware/error.middleware.js";

// Initialize Express app
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

// Health check route (✅ IMPORTANT for Render)
app.get("/trading", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Trading endpoint is active",
    timestamp: new Date().toISOString()
  });
});



// Home route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome To Trading API",
    version: "1.0.0",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// ✅ Error handler should be last
app.use(errorHandler);

export default app;