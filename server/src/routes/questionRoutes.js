const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const questionController = require("../controllers/questionController");

const authenticate = require("../../authenticate");

// Định nghĩa endpoint: POST /questions
router.post("/", authenticate.verifyUser, questionController.createQuestion);

// Định nghĩa endpoint: GET /questions
router.get("/", questionController.getAllQuestions);

// Định nghĩa endpoint: GET /questions/:questionId
router.get("/:questionId", questionController.getQuestionById);

// Định nghĩa endpoint: PUT /questions/:questionId
router.put(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAdminOrAuthor,
  questionController.updateQuestion,
);

// Định nghĩa endpoint: DELETE /questions/:questionId (admin hoặc author đều được xóa)
router.delete(
  "/:questionId",
  authenticate.verifyUser,
  authenticate.verifyAdminOrAuthor,
  questionController.deleteQuestion,
);

module.exports = router;
