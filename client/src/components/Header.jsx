import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaUser,
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2"
          to="/quizzes"
        >
          <FaBrain style={{ fontSize: "1.4rem" }} />
          <span>QuizApp</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-secondary d-flex align-items-center gap-1">
                    <FaUser size={13} /> <strong>{user.username}</strong>
                    {user.admin && (
                      <span className="badge bg-primary ms-1 badge-pill">
                        Admin
                      </span>
                    )}
                  </span>
                </li>
                {user.admin && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-dark fw-medium"
                      to="/admin/questions"
                    >
                      <FaCog className="me-1" /> Manage Questions
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-medium" to="/quizzes">
                    <FaClipboardList className="me-1" /> Quizzes
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm px-3" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
