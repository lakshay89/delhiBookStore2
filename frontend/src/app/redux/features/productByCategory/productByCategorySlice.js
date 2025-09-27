import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
export const fetchProductsByCategory = createAsyncThunk(
  "productByCategory/fetchProductsByCategory",
  async ({id, limit = 50, page = 1,sort=""}, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/product/product-by-category/${id}`,
         {
          params:{
            limit,
            page,
            sort
          }
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const productByCategorySlice = createSlice({
  name: "productByCategory",
  initialState: {
    products: [],
    loading: false,
    error: null,
    totalPages: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.category;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productByCategorySlice.reducer;
