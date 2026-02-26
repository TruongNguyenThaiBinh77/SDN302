const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // Liên kết với bảng Question
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
  }]
});

module.exports = mongoose.model('Quiz', quizSchema);


