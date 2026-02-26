const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const User = require("./src/models/User");
const Question = require("./src/models/Question"); // Needed for verifyAuthor

const config = {
  secretKey: "12345-67890-09876-54321", // Hardcoded for assignment purposes
};

// Local Strategy for username/password login
exports.local = passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      // In a real app, use bcrypt.compare here.
      // For this assignment, assuming simple string comparison or if user model has verification method.
      // Let's implement simple comparison for now as we didn't add bcrypt to plan.
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// Serialize/Deserialize user (mostly for session auth, but good to have)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600, // 1 hour
  });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // console.log("JWT payload: ", jwt_payload);
      const user = await User.findOne({ _id: jwt_payload._id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }),
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    next(err);
  }
};

exports.verifyAuthor = async (req, res, next) => {
  // This middleware assumes the questionId is in req.params.questionId or similar
  // BUT, commonly used on PUT /questions/:questionId
  const questionId = req.params.questionId || req.params.id; // handle both common cases

  if (!questionId) {
    // If no question ID, maybe it's purely checking role? But verifyAuthor implies checking relation.
    // If this is used on a generic route, we might need to rethink.
    // But for update/delete specific question, we need the ID.
    return next();
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    // Ensure req.user is present (verifyUser should be called before this)
    if (!req.user) {
      const err = new Error("You are not logged in!");
      err.status = 401;
      return next(err);
    }

    if (question.author && question.author.equals(req.user._id)) {
      next();
    } else {
      const err = new Error("You are not the author of this question");
      err.status = 403; // Or 403 Forbidden
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// Admin OR the question's author can perform the operation
exports.verifyAdminOrAuthor = async (req, res, next) => {
  // If user is admin, allow immediately
  if (req.user && req.user.admin) {
    return next();
  }
  // Otherwise check authorship
  const questionId = req.params.questionId || req.params.id;
  if (!questionId) return next();
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }
    if (question.author && question.author.equals(req.user._id)) {
      next();
    } else {
      const err = new Error(
        "You are not authorized to perform this operation!",
      );
      err.status = 403;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
