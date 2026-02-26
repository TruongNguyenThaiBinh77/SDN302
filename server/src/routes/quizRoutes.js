const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');

const authenticate = require('../../authenticate');

// Quiz
router.get('/', quizController.getAllQuizzes);
router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);
router.get('/:quizId', quizController.getQuizByIdBasic); // API #13 - Get quiz by ID
router.put('/:quizId', authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz);
router.delete('/:id', authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);
router.get('/:quizId/populate', quizController.getQuizById); // Filter by "capital"

// Question trong Quiz
router.post('/:quizId/question', authenticate.verifyUser, authenticate.verifyAdmin, questionController.createQuestionInQuiz); // Tạo 1 câu hỏi
router.post('/:quizId/questions', authenticate.verifyUser, authenticate.verifyAdmin, questionController.createQuestionsInQuiz); // Tạo nhiều câu hỏi


module.exports = router;


//QPjsBjTYcUEAd1sU
