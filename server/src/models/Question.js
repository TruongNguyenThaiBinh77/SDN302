const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  options: [{ type: String, required: true }],
  keywords: [{ type: String }], // Mảng từ khóa cho câu hỏi
  correctAnswer: { type: String, required: true },
  // Lưu ID của Quiz để tạo mối liên kết ngược
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
});

module.exports = mongoose.model("Question", questionSchema);
