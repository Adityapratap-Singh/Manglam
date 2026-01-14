require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();
app.use(cors());
app.use(express.json());

/* Serve static files */
app.use(express.static("public"));

/* Session middleware */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if using HTTPS
}));

/* Connect to MongoDB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* Mount Routes */
app.use("/api", authRoutes);
app.use("/api", guestRoutes);
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

app.listen(5000, () => console.log("Server running on port 5000"));
