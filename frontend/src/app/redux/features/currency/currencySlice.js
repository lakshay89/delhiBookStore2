import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchCurrencyInfo = createAsyncThunk(
  "currency/fetchCurrencyInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/currency/detect-country");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currency: "INR",
    exchangeRate: 86,
    country: "IN",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrencyInfo.fulfilled, (state, action) => {
        state.currency = action.payload.currency;
        state.exchangeRate = action.payload.exchangeRate;
        state.country = action.payload.country;
        state.loading = false;
      })
      .addCase(fetchCurrencyInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default currencySlice.reducer;
