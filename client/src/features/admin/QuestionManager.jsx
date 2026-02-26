import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestions,
  createQuestion,
  deleteQuestion,
  updateQuestion,
  clearQuestionMessage,
} from "./questionSlice";
import { fetchQuizzes } from "../quizzes/quizSlice";
import Header from "../../components/Header";
import {
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPencilAlt,
  FaPlus,
  FaThumbtack,
  FaCheck,
  FaTrash,
  FaQuestionCircle,
} from "react-icons/fa";

const emptyForm = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  quizId: "",
};

const QuestionManager = () => {
  const dispatch = useDispatch();
  const {
    list: questions,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.questions);
  const { list: quizzes } = useSelector((state) => state.quizzes);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = create mode, id = edit mode

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearQuestionMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // UPDATE mode
      dispatch(
        updateQuestion({
          id: editingId,
          questionData: {
            questionText: formData.questionText,
            options: formData.options,
            correctAnswer: formData.correctAnswer,
          },
        }),
      );
      setEditingId(null);
    } else {
      // CREATE mode
      if (!formData.quizId) {
        alert("Please select a quiz");
        return;
      }
      dispatch(
        createQuestion({
          quizId: formData.quizId,
          questionData: {
            questionText: formData.questionText,
            options: formData.options,
            correctAnswer: formData.correctAnswer,
          },
        }),
      );
    }
    setFormData(emptyForm);
  };

  const handleEdit = (q) => {
    setEditingId(q._id);
    setFormData({
      questionText: q.questionText,
      options:
        q.options.length === 4
          ? [...q.options]
          : [...q.options, "", "", "", ""].slice(0, 4),
      correctAnswer: q.correctAnswer,
      quizId: q.quiz,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteQuestion(id));
    }
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        {/* Page Header */}
        <div className="page-header">
          <h2 className="fw-bold mb-0">
            <FaCog className="me-2" />
            Question Management
          </h2>
          <p className="text-muted mb-0 mt-1">
            Create and manage quiz questions
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="alert alert-success border-0 rounded-3">
            <FaCheckCircle className="me-1" /> {successMessage}
          </div>
        )}
        {error && (
          <div className="alert alert-danger border-0 rounded-3">
            <FaExclamationTriangle className="me-1" />{" "}
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        <div className="row g-4">
          {/* Form Panel */}
          <div className="col-lg-5">
            <div
              className={`card border-0 shadow-sm rounded-4 sticky-top`}
              style={{ top: "80px" }}
            >
              <div
                className={`card-header border-0 rounded-top-4 py-3 px-4 ${editingId ? "bg-warning bg-opacity-15" : "bg-primary bg-opacity-10"}`}
              >
                <h6 className="fw-bold mb-0">
                  {editingId ? (
                    <>
                      <FaPencilAlt className="me-1" />
                      Edit Question
                    </>
                  ) : (
                    <>
                      <FaPlus className="me-1" />
                      Create New Question
                    </>
                  )}
                </h6>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {!editingId && (
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Select Quiz
                      </label>
                      <select
                        className="form-select rounded-3"
                        name="quizId"
                        value={formData.quizId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose a quiz...</option>
                        {quizzes.map((q) => (
                          <option key={q._id} value={q._id}>
                            {q.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {editingId && (
                    <div className="mb-3 p-2 bg-warning bg-opacity-10 rounded-3">
                      <small className="text-muted">
                        <FaThumbtack size={11} className="me-1" />
                        Editing question in:{" "}
                        <strong>
                          {quizzes.find((qz) => qz._id === formData.quizId)
                            ?.title || "Unknown Quiz"}
                        </strong>
                      </small>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Question Text
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows={2}
                      name="questionText"
                      placeholder="Type your question here..."
                      value={formData.questionText}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Answer Options
                    </label>
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="input-group mb-2">
                        <span
                          className="input-group-text bg-light border-end-0 rounded-start-3 text-muted"
                          style={{ minWidth: "40px" }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 rounded-end-3"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <FaCheck className="me-1 text-success" />
                      Correct Answer
                    </label>
                    <select
                      className="form-select rounded-3"
                      name="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select correct answer...</option>
                      {formData.options
                        .filter((o) => o.trim() !== "")
                        .map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className={`btn rounded-3 px-4 ${editingId ? "btn-warning" : "btn-primary"}`}
                      disabled={loading}
                    >
                      {editingId ? "Save Changes" : "Create Question"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-3"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                All Questions{" "}
                <span className="badge bg-secondary rounded-pill ms-1">
                  {questions.length}
                </span>
              </h5>
            </div>
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary spinner-border-sm"></div>
                <span className="text-muted ms-2">Loading...</span>
              </div>
            )}
            {!loading && questions.length === 0 && (
              <div className="text-center py-5 text-muted">
                <FaQuestionCircle
                  style={{ fontSize: "2.5rem" }}
                  className="text-muted"
                />
                <p className="mt-2">No questions yet. Create the first one!</p>
              </div>
            )}
            <div className="d-flex flex-column gap-3">
              {questions.map((q, i) => {
                const quizTitle = quizzes.find(
                  (qz) => qz._id === q.quiz,
                )?.title;
                const isEditing = editingId === q._id;
                return (
                  <div
                    key={q._id}
                    className={`card border-0 rounded-4 shadow-sm ${isEditing ? "border border-warning border-2" : ""}`}
                  >
                    <div className="card-body p-3 px-4">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span
                              className="badge bg-light text-secondary border rounded-pill"
                              style={{ fontSize: "0.75rem" }}
                            >
                              Q{i + 1}
                            </span>
                            {quizTitle && (
                              <span
                                className="badge bg-primary bg-opacity-10 text-primary rounded-pill"
                                style={{ fontSize: "0.72rem" }}
                              >
                                {quizTitle}
                              </span>
                            )}
                            {isEditing && (
                              <span
                                className="badge bg-warning text-dark rounded-pill"
                                style={{ fontSize: "0.72rem" }}
                              >
                                Editing...
                              </span>
                            )}
                          </div>
                          <p
                            className="fw-semibold mb-1"
                            style={{ fontSize: "0.95rem" }}
                          >
                            {q.questionText}
                          </p>
                          <div className="d-flex flex-wrap gap-1 mt-2">
                            {q.options.map((opt, idx) => (
                              <span
                                key={idx}
                                className={`badge rounded-3 px-2 py-1 ${opt === q.correctAnswer ? "bg-success text-white" : "bg-light text-secondary border"}`}
                                style={{ fontSize: "0.78rem" }}
                              >
                                {String.fromCharCode(65 + idx)}. {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-1 flex-shrink-0">
                          <button
                            className="btn btn-outline-warning btn-sm rounded-3"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => handleEdit(q)}
                          >
                            <FaPencilAlt size={12} className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-3"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => handleDelete(q._id)}
                          >
                            <FaTrash size={12} className="me-1" />
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionManager;
