import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncAction';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        message: '',
        currentCart: [],
        cart: [],
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.current = null;
            state.token = null;
            state.message = '';
        },
        clearMessage: (state) => {
            state.message = '';
        },
        updateCart: (state, action) => {
            const { pid, quantity, color } = action.payload;
            const updatingCart = JSON.parse(JSON.stringify(state.currentCart));
            state.currentCart = updatingCart.map((el) => {
                if (el?.product?._id === pid && el?.color === color) {
                    return { ...el, quantity: quantity };
                } else {
                    return el;
                }
            });
        },
        addToCart: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item._id === action.payload._id,
            );
            if (itemPresent) {
                itemPresent.quantity += 1;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const removeItem = state.cart.filter(
                (item) => item._id !== action.payload._id,
            );
            state.cart = removeItem;
        },
        incementQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item._id === action.payload._id,
            );
            itemPresent.quantity++;
        },
        decrementQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item._id === action.payload._id,
            );
            if (itemPresent.quantity === 1) {
                itemPresent.quantity = 0;
                const removeItem = state.cart.filter(
                    (item) => item._id !== action.payload._id,
                );
                state.cart = removeItem;
            } else {
                itemPresent.quantity--;
            }
        },
        cleanCart: (state) => {
            state.cart = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state, action) => {
            state.s;
        });
        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.current = action.payload;
            state.isLoggedIn = true;
            state.currentCart = action.payload.cart;
        });

        builder.addCase(actions.getCurrent.rejected, (state) => {
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.message = 'Please login to continue';
        });
    },
});

export const {
    login,
    logout,
    clearMessage,
    updateCart,
    addToCart,
    removeFromCart,
    incementQuantity,
    decrementQuantity,
    cleanCart,
} = userSlice.actions;
export default userSlice.reducer;
