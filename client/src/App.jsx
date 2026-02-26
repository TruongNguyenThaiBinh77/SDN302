import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import { useSelector } from 'react-redux';

import QuizList from './features/quizzes/QuizList';
import QuizDetail from './features/quizzes/QuizDetail';

import QuestionManager from './features/admin/QuestionManager';

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
      {/* <Header /> moved to pages or added here if global */}
      <div className="container-fluid p-0"> {/* Use container-fluid or manage in components */}
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
      </div>
    </Router>
  );
}

export default App;
