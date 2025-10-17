import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch the wishlist
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            const { data } = await axios.get('/api/v1/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.wishlist.products;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Thunk to add/remove an item
export const toggleWishlistItem = createAsyncThunk(
    'wishlist/toggleWishlistItem',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const { auth: { token } } = getState();
            const { data } = await axios.post('/api/v1/wishlist', { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.wishlist.products;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                state.products = action.payload;
            });
    },
});

export default wishlistSlice.reducer;