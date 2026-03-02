import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessage } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, user } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "login-error" });
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { toastId: "login-success" });
    }
  }, [successMessage]);

  useEffect(() => {
    if (user) navigate("/quizzes");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="auth-wrapper">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <FaBrain style={{ fontSize: "3rem" }} className="text-primary" />
          <h1 className="h3 fw-bold text-primary mt-2">QuizApp</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Username</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="fw-semibold text-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
