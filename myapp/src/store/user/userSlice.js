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
        lastActiveTime: '',
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
            const { pid, color, quantity, price, thumbnail, title } =
                action.payload;
            const existingItem = state.currentCart.find(
                (item) => item.product._id === pid && item.color === color,
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.currentCart.push({
                    product: { _id: pid },
                    quantity,
                    color,
                    price,
                    thumbnail,
                    title,
                });
            }
        },
        removeFromCart: (state, action) => {
            const { pid, color } = action.payload;
            state.currentCart = state.currentCart.filter(
                (item) => item.product?._id !== pid || item?.color !== color,
            );
        },
        incrementQuantity: (state, action) => {
            const { pid, color } = action.payload;
            state.currentCart = state.currentCart.map((item) =>
                item.product._id === pid && item.color === color
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
            );
        },
        decrementQuantity: (state, action) => {
            const { pid, color } = action.payload;
            state.currentCart = state.currentCart.map((item) =>
                item.product._id === pid && item.color === color
                    ? { ...item, quantity: item.quantity - 1 }
                    : item,
            );
        },
        cleanCart: (state) => {
            state.currentCart = [];
        },
        setLastActiveTime: (state, action) => {
            state.lastActiveTime = action.payload.lastActiveTime;
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
    incrementQuantity,
    decrementQuantity,
    cleanCart,
    setLastActiveTime,
} = userSlice.actions;
export default userSlice.reducer;
