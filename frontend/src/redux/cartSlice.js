import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance'; // Using the correct instance

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get('/v1/cart');
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addItemToCart = createAsyncThunk('cart/addItemToCart', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/v1/cart', { productId, quantity });
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
});

export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/v1/cart/${itemId}`, { quantity });
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
});

export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async (itemId, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete(`/v1/cart/${itemId}`);
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
});

export const applyCoupon = createAsyncThunk('cart/applyCoupon', async (couponCode, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/v1/coupon/apply', { couponCode });
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
    }
});

// ✨ FIX: This thunk now sends a POST request to the correct '/v1/coupon/remove' endpoint.
export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post('/v1/coupon/remove');
        return data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], coupon: null, loading: false, error: null },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.coupon = null;
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };
        const handleFulfilled = (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.items = action.payload.items || [];
                state.coupon = action.payload.coupon || null;
            }
        };
        
        builder
            .addCase(fetchCart.pending, handlePending).addCase(fetchCart.fulfilled, handleFulfilled).addCase(fetchCart.rejected, handleRejected)
            .addCase(addItemToCart.pending, handlePending).addCase(addItemToCart.fulfilled, handleFulfilled).addCase(addItemToCart.rejected, handleRejected)
            .addCase(updateCartItemQuantity.pending, handlePending).addCase(updateCartItemQuantity.fulfilled, handleFulfilled).addCase(updateCartItemQuantity.rejected, handleRejected)
            .addCase(removeItemFromCart.pending, handlePending).addCase(removeItemFromCart.fulfilled, handleFulfilled).addCase(removeItemFromCart.rejected, handleRejected)
            .addCase(applyCoupon.pending, handlePending).addCase(applyCoupon.fulfilled, handleFulfilled).addCase(applyCoupon.rejected, handleRejected)
            .addCase(removeCoupon.pending, handlePending).addCase(removeCoupon.fulfilled, handleFulfilled).addCase(removeCoupon.rejected, handleRejected);
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

