import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  clearQuizMessage,
} from "./quizSlice";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import {
  FaClipboardList,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPencilAlt,
  FaTrash,
  FaInbox,
  FaArrowRight,
} from "react-icons/fa";

const emptyForm = { title: "", description: "" };

const COLORS = ["primary", "success", "info", "warning", "danger", "secondary"];

const QuizList = () => {
  const dispatch = useDispatch();
  const { list, loading, error, successMessage } = useSelector(
    (state) => state.quizzes,
  );
  const { user } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearQuizMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateQuiz({ id: editingId, quizData: formData }));
      setEditingId(null);
    } else {
      dispatch(createQuiz(formData));
    }
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (quiz) => {
    setEditingId(quiz._id);
    setFormData({ title: quiz.title, description: quiz.description || "" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this quiz and all its questions?")) {
      dispatch(deleteQuiz(id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center page-header">
          <div>
            <h2 className="fw-bold mb-0">
              <FaClipboardList className="me-2" />
              Available Quizzes
            </h2>
            <p className="text-muted mb-0 mt-1">
              Test your knowledge with our quizzes
            </p>
          </div>
          {user?.admin && !showForm && (
            <button
              className="btn btn-primary px-4 rounded-3"
              onClick={() => setShowForm(true)}
            >
              <FaPlus className="me-1" /> New Quiz
            </button>
          )}
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

        {/* Create / Edit Form */}
        {user?.admin && showForm && (
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                {editingId ? (
                  <>
                    <FaPencilAlt className="me-1" />
                    Edit Quiz
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" />
                    Create New Quiz
                  </>
                )}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Title</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. World Geography"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Description</label>
                  <textarea
                    className="form-control rounded-3"
                    rows={2}
                    placeholder="Brief description of this quiz..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-3 px-4"
                    disabled={loading}
                  >
                    {editingId ? "Save Changes" : "Create Quiz"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading quizzes...</p>
          </div>
        )}

        {/* Quiz Grid */}
        <div className="row g-3 mt-1">
          {list.map((quiz, i) => {
            const color = COLORS[i % COLORS.length];
            const count = quiz.questions?.length || 0;
            return (
              <div key={quiz._id} className="col-sm-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 card-hover">
                  <div
                    className={`card-header bg-${color} bg-opacity-10 border-0 rounded-top-4 pt-3 pb-2 px-4`}
                  >
                    <span
                      className={`badge bg-${color} bg-opacity-25 text-${color} badge-pill mb-1`}
                    >
                      {count} question{count !== 1 ? "s" : ""}
                    </span>
                    <h5 className="card-title fw-bold mb-0 mt-1">
                      {quiz.title}
                    </h5>
                  </div>
                  <div className="card-body d-flex flex-column px-4 pt-3">
                    <p
                      className="card-text text-muted flex-grow-1"
                      style={{ fontSize: "0.92rem", minHeight: "3rem" }}
                    >
                      {quiz.description || (
                        <span className="fst-italic">No description</span>
                      )}
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={`/quizzes/${quiz._id}`}
                        className={`btn btn-${color} rounded-3 btn-sm px-3`}
                      >
                        Take Quiz <FaArrowRight size={11} className="ms-1" />
                      </Link>
                      {user?.admin && (
                        <>
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-3"
                            onClick={() => handleEdit(quiz)}
                          >
                            <FaPencilAlt size={12} />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-3"
                            onClick={() => handleDelete(quiz._id)}
                          >
                            <FaTrash size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && list.length === 0 && (
            <div className="col-12 text-center py-5">
              <FaInbox style={{ fontSize: "3rem" }} className="text-muted" />
              <p className="text-muted mt-2">No quizzes available yet.</p>
              {user?.admin && (
                <button
                  className="btn btn-primary rounded-3"
                  onClick={() => setShowForm(true)}
                >
                  Create the first quiz
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizList;
