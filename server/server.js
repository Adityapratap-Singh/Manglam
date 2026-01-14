require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// Import security middleware
const {
  securityHeaders,
  loginLimiter,
  apiLimiter,
  guestLimiter,
  sanitizeData,
  validateInput,
  corsOptions,
  secureSession,
  addSecurityHeaders,
  limitPayloadSize,
} = require("./middleware/securityMiddleware");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

/* Trust proxy if behind a reverse proxy (important for rate limiting) */
app.set("trust proxy", 1);

/* Apply security headers first */
app.use(securityHeaders);
app.use(addSecurityHeaders);

/* CORS middleware with secure configuration */
app.use(cors(corsOptions));

/* Limit payload size */
app.use(limitPayloadSize);

/* Body parser with size limits */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* Data sanitization (prevent NoSQL injection) */
app.use(sanitizeData);

/* Input validation */
app.use(validateInput);

/* Apply general API rate limiting */
app.use("/api", apiLimiter);

/* Serve static files */
app.use(express.static("public"));

/* Session middleware with secure configuration */
app.use(session(secureSession));

/* Connect to MongoDB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* Mount Routes */
app.use("/api/auth", loginLimiter, authRoutes); // Apply rate limiting to auth
app.use("/api", guestLimiter, guestRoutes); // Apply rate limiting to guest lookups
app.use(pageRoutes);

/* Root redirect to login */
app.get("/", (req, res) => {
  res.redirect("/login");
});

/* Serve login page */
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

/* Error handling middleware */
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
