import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/questions");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async ({ quizId, questionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/quizzes/${quizId}/question`,
        questionData,
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  },
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/questions/${id}`,
        questionData,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update failed" },
      );
    }
  },
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/questions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Delete failed" },
      );
    }
  },
);

const questionSlice = createSlice({
  name: "questions",
  initialState: {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearQuestionMessage: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        // If the list is comprehensive, we might push. But fetching all is safer if logic is complex.
        // For now push is fine.
        state.list.push(action.payload);
        state.successMessage = "Question created successfully!";
        state.error = null;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create question";
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
        state.successMessage = "Question deleted successfully!";
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete question";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.list.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.successMessage = "Question updated successfully!";
        state.error = null;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update question";
      });
  },
});

export const { clearQuestionMessage } = questionSlice.actions;
export default questionSlice.reducer;
