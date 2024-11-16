import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCategories = createAsyncThunk(
    'app/getCategories',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apis.apiGetCategories();
            return response.productCategories;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
