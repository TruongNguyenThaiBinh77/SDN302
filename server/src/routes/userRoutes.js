const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const authenticate = require("../../authenticate");

router.post("/signup", async (req, res) => {
  try {
    const { username, password, admin } = req.body;
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ err: "Username and password required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ err: "User already exists" });
    }

    const newUser = new User({ username, password, admin: admin || false });
    await newUser.save();
    res.status(200).json({ status: "Registration Successful!", user: newUser });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({
      _id: req.user._id,
      admin: req.user.admin,
    }); // Payload
    res.status(200).json({
      status: "Login Successful!",
      success: true,
      token: token,
      user: {
        _id: req.user._id,
        username: req.user.username,
        admin: req.user.admin,
      },
    });
  },
);

// GET /users - Admin only
router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
);

module.exports = router;
