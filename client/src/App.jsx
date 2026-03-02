import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import { useSelector } from "react-redux";

import QuizList from "./features/quizzes/QuizList";
import QuizDetail from "./features/quizzes/QuizDetail";

import QuestionManager from "./features/admin/QuestionManager";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user || !user.admin) {
    return <Navigate to="/quizzes" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/quizzes" />} />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <QuestionManager />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
