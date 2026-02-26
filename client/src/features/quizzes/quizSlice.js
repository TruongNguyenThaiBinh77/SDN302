import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const fetchQuizzes = createAsyncThunk(
  "quizzes/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/quizzes");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

export const fetchQuizById = createAsyncThunk(
  "quizzes/fetchQuizById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quizzes/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

export const createQuiz = createAsyncThunk(
  "quizzes/createQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/quizzes", quizData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  },
);

export const updateQuiz = createAsyncThunk(
  "quizzes/updateQuiz",
  async ({ id, quizData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/quizzes/${id}`, quizData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  },
);

export const deleteQuiz = createAsyncThunk(
  "quizzes/deleteQuiz",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/quizzes/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    list: [],
    currentQuiz: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearQuizMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.successMessage = "Quiz created successfully!";
        state.error = null;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create quiz";
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const idx = state.list.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.successMessage = "Quiz updated successfully!";
        state.error = null;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update quiz";
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
        state.successMessage = "Quiz deleted successfully!";
        state.error = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete quiz";
      });
  },
});

export const { clearQuizMessage } = quizSlice.actions;
export default quizSlice.reducer;
