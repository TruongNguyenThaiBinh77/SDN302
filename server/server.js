const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Import Routes
const quizRoutes = require("./src/routes/quizRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const userRoutes = require("./src/routes/userRoutes");
const passport = require("passport");

const app = express();
const PORT = 3443; // Standard HTTPS port or any free port, 3443 is common for dev

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Serve static files from client folder (Optional if we are going to run client separately, but good to have)
app.use(express.static("client"));

// Kết nối MongoDB - Database tên là SimpleQuiz
mongoose
  .connect("mongodb://127.0.0.1:27017/SimpleQuiz")
  .then(() => console.log("Connected to MongoDB SimpleQuiz"))
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

// Start HTTPS server
// Load certificates
// Ensure generated_cert_forge.js created them in the root of server directory
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
