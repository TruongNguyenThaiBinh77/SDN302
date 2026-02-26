import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "./quizSlice";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaTrophy,
  FaSmile,
  FaFrown,
  FaCheck,
  FaTimes,
  FaRocket,
} from "react-icons/fa";

const QuizDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, loading, error } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    dispatch(fetchQuizById(id));
    setSubmitted(false);
    setAnswers({});
    setScore(0);
  }, [dispatch, id]);

  const handleOptionChange = (questionId, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const unanswered = currentQuiz.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      if (
        !window.confirm(
          `You have ${unanswered.length} unanswered question(s). Submit anyway?`,
        )
      )
        return;
    }
    let newScore = 0;
    currentQuiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) newScore++;
    });
    setScore(newScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading quiz...</p>
        </div>
      </>
    );
  if (error)
    return (
      <>
        <Header />
        <div className="container mt-4">
          <div className="alert alert-danger rounded-3">
            <FaExclamationTriangle className="me-1" /> {JSON.stringify(error)}
          </div>
        </div>
      </>
    );
  if (!currentQuiz)
    return (
      <>
        <Header />
        <div className="container mt-4 text-center text-muted">
          Quiz not found
        </div>
      </>
    );

  const total = currentQuiz.questions?.length || 0;
  const answered = Object.keys(answers).length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;

  const getOptionClass = (q, option) => {
    if (!submitted) return "";
    if (option === q.correctAnswer) return "option-correct";
    if (answers[q._id] === option && option !== q.correctAnswer)
      return "option-wrong";
    return "";
  };

  return (
    <>
      <Header />
      <div className="container py-4" style={{ maxWidth: "760px" }}>
        {/* Quiz Header */}
        <div className="mb-4">
          <button
            className="btn btn-sm btn-outline-secondary rounded-3 mb-3"
            onClick={() => navigate("/quizzes")}
          >
            <FaArrowLeft className="me-1" /> Back to Quizzes
          </button>
          <h2 className="fw-bold">{currentQuiz.title}</h2>
          {currentQuiz.description && (
            <p className="text-muted">{currentQuiz.description}</p>
          )}
        </div>

        {/* Score Result Banner */}
        {submitted && (
          <div
            className={`card border-0 rounded-4 shadow-sm mb-4 ${scorePct >= 70 ? "bg-success" : scorePct >= 40 ? "bg-warning" : "bg-danger"} bg-opacity-10`}
          >
            <div className="card-body p-4 text-center">
              <div style={{ fontSize: "3.5rem" }} className="text-center">
                {scorePct >= 70 ? (
                  <FaTrophy className="text-success" />
                ) : scorePct >= 40 ? (
                  <FaSmile className="text-warning" />
                ) : (
                  <FaFrown className="text-danger" />
                )}
              </div>
              <h3 className="fw-bold mt-2">
                {score} / {total} correct
              </h3>
              <p className="text-muted mb-3">
                {scorePct}% —{" "}
                {scorePct >= 70
                  ? "Great job!"
                  : scorePct >= 40
                    ? "Keep practicing!"
                    : "Better luck next time!"}
              </p>
              <div className="progress mb-3" style={{ height: "10px" }}>
                <div
                  className={`progress-bar ${scorePct >= 70 ? "bg-success" : scorePct >= 40 ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${scorePct}%` }}
                ></div>
              </div>
              <button
                className="btn btn-primary rounded-3 px-4"
                onClick={() => navigate("/quizzes")}
              >
                Back to Quiz List
              </button>
            </div>
          </div>
        )}

        {/* Progress bar (before submit) */}
        {!submitted && total > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted fw-medium">Progress</small>
              <small className="text-muted">
                {answered}/{total} answered
              </small>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${pct}%`, transition: "width 0.3s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Questions */}
        {currentQuiz.questions &&
          currentQuiz.questions.map((q, index) => (
            <div key={q._id} className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <span
                    className={`badge rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${answers[q._id] ? "bg-primary" : "bg-light text-secondary border"}`}
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-3">{q.questionText}</h6>
                    <div>
                      {q.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`option-label ${getOptionClass(q, option)} ${!submitted && answers[q._id] === option ? "border-primary bg-primary bg-opacity-10" : ""}`}
                          onClick={() => handleOptionChange(q._id, option)}
                          style={{ cursor: submitted ? "default" : "pointer" }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`rounded-circle border d-inline-flex align-items-center justify-content-center flex-shrink-0 ${!submitted && answers[q._id] === option ? "bg-primary border-primary" : "bg-white"}`}
                              style={{ width: "20px", height: "20px" }}
                            >
                              {!submitted && answers[q._id] === option && (
                                <span
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    background: "white",
                                    display: "block",
                                  }}
                                ></span>
                              )}
                              {submitted && option === q.correctAnswer && (
                                <FaCheck size={10} style={{ color: "white" }} />
                              )}
                              {submitted &&
                                answers[q._id] === option &&
                                option !== q.correctAnswer && (
                                  <FaTimes
                                    size={10}
                                    style={{ color: "#dc3545" }}
                                  />
                                )}
                            </span>
                            <span style={{ fontSize: "0.95rem" }}>
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Submit Button */}
        {!submitted && (
          <div className="text-center mt-4">
            <button
              className="btn btn-success btn-lg rounded-3 px-5"
              onClick={handleSubmit}
              disabled={answered === 0}
            >
              Submit Quiz <FaRocket className="ms-1" />
            </button>
            {answered === 0 && (
              <p className="text-muted mt-2 small">
                Answer at least one question to submit.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QuizDetail;
