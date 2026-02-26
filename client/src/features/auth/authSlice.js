import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/users/login', credentials);
        localStorage.setItem('token', response.data.token);
        // Persist user in local storage to keep logged in state on refresh (simplified)
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        return response.data; 
    } catch (err) {
        return rejectWithValue(err.response?.data || { err: 'Login failed' });
    }
});

export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/users/signup', userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { err: 'Signup failed' });
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    successMessage: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearMessage: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.successMessage = "Login Successful!";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.err || action.payload.message || 'Login failed';
            })
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = "Signup Successful! Please login.";
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.err || 'Signup failed';
            });
    }
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
