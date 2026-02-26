const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// GET /quizzes - Lấy danh sách Quiz và hiển thị luôn nội dung câu hỏi (Populate)
exports.getAllQuizzes = async (req, res) => {
  try {
    // .populate('questions') sẽ thay thế ID câu hỏi bằng toàn bộ object Question
    const quizzes = await Quiz.find().populate("questions");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /quizzes/:quizId - Lấy quiz theo ID với populate (không filter)
exports.getQuizByIdBasic = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy Quiz này" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /quizzes/:quizId/populate - Lọc câu hỏi theo keyword "capital"
exports.getQuizById = async (req, res) => {
  try {
    // Tìm Quiz và thay thế mảng ID câu hỏi bằng nội dung object Question chi tiết
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy Quiz này" });
    }

    // Lọc các câu hỏi có chứa từ khóa "capital"
    const filteredQuestions = quiz.questions.filter(question => 
      question.keywords && question.keywords.some(keyword => 
        keyword.toLowerCase().includes("capital")
      )
    );

    // Trả về quiz với danh sách câu hỏi đã lọc
    res.status(200).json({
      ...quiz.toObject(),
      questions: filteredQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /quizzes - Tạo Quiz mới
exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /quizzes/:quizId - Cập nhật Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /quizzes/:id - Xóa Quiz và tất cả câu hỏi liên quan (Cascade Delete)
exports.deleteQuiz = async (req, res) => {
  try {
    // Kiểm tra quiz có tồn tại không
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Xóa tất cả câu hỏi liên quan đến quiz này
    await Question.deleteMany({ quiz: req.params.id });

    // Sau đó xóa quiz
    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: "Quiz and associated questions deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
