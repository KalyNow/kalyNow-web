import { createSlice } from '@reduxjs/toolkit';
import { loginProvider, registerProvider, logoutProvider } from './authFeatureProvider';

interface AuthFeatureState {
    loading: boolean;
    error: string | null;
    success: string | null;
    isLoggedIn: boolean;
}

const initialState: AuthFeatureState = {
    loading: false,
    error: null,
    success: null,
    isLoggedIn: false,
};

const authFeatureSlice = createSlice({
    name: 'authFeature',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        resetAuthFeatureState: (state) => {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginProvider.fulfilled, (state) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.success = 'Login successful!';
            })
            .addCase(loginProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })

            // Register
            .addCase(registerProvider.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerProvider.fulfilled, (state) => {
                state.loading = false;
                state.success = 'Registration successful! Please log in.';
            })
            .addCase(registerProvider.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
            })

            // Logout
            .addCase(logoutProvider.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.success = null;
                state.error = null;
            });
    },
});

export const { clearError, clearSuccess, resetAuthFeatureState } = authFeatureSlice.actions;
export const authFeatureReducer = authFeatureSlice.reducer;
