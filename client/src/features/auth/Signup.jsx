import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearMessage } from "./authSlice";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserShield,
} from "react-icons/fa";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser({ username, password, admin: isAdmin }));
  };

  return (
    <div className="auth-wrapper">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <FaBrain style={{ fontSize: "3rem" }} className="text-primary" />
          <h1 className="h3 fw-bold text-primary mt-2">QuizApp</h1>
          <p className="text-muted">Create your account</p>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger border-0 rounded-3">
                <FaExclamationTriangle className="me-1" /> {error}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success border-0 rounded-3">
                <FaCheckCircle className="me-1" /> {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4 p-3 bg-light rounded-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="adminCheck"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <label
                    className="form-check-label fw-medium"
                    htmlFor="adminCheck"
                  >
                    <FaUserShield className="me-1" /> Register as Admin
                  </label>
                  <div className="form-text">
                    Admins can create and manage quizzes &amp; questions.
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
