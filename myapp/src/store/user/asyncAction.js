import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCurrent = createAsyncThunk(
    'user/getCurrent',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apis.apiGetCurrent();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
