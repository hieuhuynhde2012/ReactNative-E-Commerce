import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';
import CustomedLoading from '../../components/CustomedLoading';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isShownModal: false,
        modalChildren: null,
    },
    reducers: {
        showLoading: (state, action) => {
            state.isShownModal = true;
            state.modalChildren = action.payload;
        },
        hideLoading: (state) => {
            state.isShownModal = false;
            state.modalChildren = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCategories.pending, (state) => {});

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
        });

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.errorMessage = action?.payload?.message;
        });
    },
});

export const { showLoading, hideLoading } = appSlice.actions;
export default appSlice.reducer;
