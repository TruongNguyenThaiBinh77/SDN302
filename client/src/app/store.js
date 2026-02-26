import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import quizReducer from '../features/quizzes/quizSlice';
import questionReducer from '../features/admin/questionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    questions: questionReducer,
  },
});
