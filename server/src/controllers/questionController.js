const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// 1. Tạo câu hỏi mới
exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question({
      ...req.body,
      author: req.user._id,
    });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy danh sách tất cả câu hỏi (Sửa lỗi logic)
exports.getAllQuestions = async (req, res) => {
  try {
    // SỬA LỖI: Dùng model Question, không phải Quiz
    // SỬA LỖI: Bỏ .populate() vì Question không liên kết đi đâu cả
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Lấy 1 câu hỏi theo ID (Thêm mới vì routes yêu cầu)
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3b. Cập nhật câu hỏi theo ID
exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3c. Xóa câu hỏi theo ID
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Xóa question ID khỏi quiz
    await Quiz.findByIdAndUpdate(question.quiz, {
      $pull: { questions: req.params.questionId },
    });

    // Xóa question
    await Question.findByIdAndDelete(req.params.questionId);

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Tạo câu hỏi và liên kết với Quiz
exports.createQuestionInQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // 1. Check quiz tồn tại
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 2. Tạo question gắn quiz
    const newQuestion = new Question({
      ...req.body,
      quiz: quizId,
      author: req.user._id,
    });

    const savedQuestion = await newQuestion.save();

    // 3. Push question vào quiz
    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    res.status(201).json({
      success: true,
      data: savedQuestion,
    });
  } catch (error) {
    console.error("[createQuestionInQuiz]", error.message, error);
    res.status(500).json({ message: error.message });
  }
};

// 5. Tạo nhiều câu hỏi trong một Quiz
exports.createQuestionsInQuiz = async (req, res) => {
  try {
    console.log(req.body); // 👈 DEBUG, RẤT QUAN TRỌNG

    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionsInput = Array.isArray(req.body) ? req.body : [req.body];

    const questionsToInsert = questionsInput.map((q) => ({
      ...q,
      quiz: quizId,
      author: req.user._id,
    }));

    const savedQuestions = await Question.insertMany(questionsToInsert);

    quiz.questions.push(...savedQuestions.map((q) => q._id));
    await quiz.save();

    res.status(201).json({
      success: true,
      count: savedQuestions.length,
      data: savedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
