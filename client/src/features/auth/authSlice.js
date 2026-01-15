import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "./authService";

export const loginUser = createAsyncThunk(
	"auth/login",
	async (data, { rejectWithValue }) => {
		try {
			return await login(data);
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Login failed"
			);
		}
	}
);

export const registerUser = createAsyncThunk(
	"auth/register",
	async (data, { rejectWithValue }) => {
		try {
			return await register(data);
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Registration failed"
			);
		}
	}
);

const userFromStorage = localStorage.getItem("user");

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: userFromStorage ? JSON.parse(userFromStorage) : null,
		error: null,
		loading: false,
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.error = null;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.loading = false;
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.loading = false;
				state.error = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
