// redux/features/auth/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      // alert(JSON.stringify(loginData))
      const response = await axiosInstance.post("/auth/login", loginData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/sign-up", userData);
      return response.data?.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred during signup"
      );
    }
  }
);

export const verifyUser = createAsyncThunk("auth/verifyUser", async () => {
  const response = await axiosInstance.get("/auth/verify-user");
  // console.log("response===>", response.data.data.user);
  return response.data.data.user;
});

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        updatedUser
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const updateProfileImg = createAsyncThunk(
  "auth/updateProfileImg",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append("image", updatedUser.image);
      const response = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);
export const handleLogout = async () => {
  try {
    const userLogout = await axiosInstance.post("/auth/logout");
    console.log("LOGIN===>", userLogout);
    if (userLogout) {
      toast.success("Logout successfully");
    }
  } catch (error) {
    console.log("logout error", error.message);
  }
};

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileImg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImg.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProfileImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetState } = loginSlice.actions;
export default loginSlice.reducer;
