import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        alert: {
            isShown: false,
            title: '',
            icon: '',
            message: '',
            onConfirmText: '',
            onCancelText: '',
            closable: false,
        },
        modal: {
            isShownModal: false,
            backdropClosable: false,
        },
        isAlreadyShownIntro: false,
    },
    reducers: {
        showLoading: (state) => {
            state.isLoading = true;
        },
        hideLoading: (state) => {
            state.isLoading = false;
        },
        showAlert: (state, action) => {
            state.alert = {
                isShown: true,
                title: action.payload.title || '',
                icon: action.payload.icon || '',
                message: action.payload.message,
                onConfirmText: action.payload.onConfirmText || 'OK',
                onCancelText: action.payload.onCancelText || 'Cancel',
                closable: action.payload.closable || false,
            };
        },
        hideAlert: (state) => {
            state.alert.isShown = false;
        },
        showModal: (state, action) => {
            state.modal.isShownModal = true;
            state.modal.backdropClosable =
                action.payload.backdropClosable || false;
        },
        hideModal: (state) => {
            state.modal.isShownModal = false;
            state.modal.backdropClosable = false;
        },
        setIsAlreadyShownIntro: (state, action) => {
            state.isAlreadyShownIntro = action.payload.isAlreadyShownIntro;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action?.payload?.message;
        });
    },
});

export const {
    showLoading,
    hideLoading,
    showAlert,
    hideAlert,
    showModal,
    hideModal,
    setIsAlreadyShownIntro,
} = appSlice.actions;
export default appSlice.reducer;
