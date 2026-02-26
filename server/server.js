const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import Routes
const quizRoutes = require("./src/routes/quizRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const userRoutes = require("./src/routes/userRoutes");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Kết nối MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SimpleQuiz";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Sử dụng Routes
app.use("/users", userRoutes);
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message, err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Start HTTP server (Render handles SSL termination)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
