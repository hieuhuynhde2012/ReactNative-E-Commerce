import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import userSlice from './user/userSlice';
import { alertMiddleware, modalMiddleware } from './app/middlewares';
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const commonConfig = {
    storage: AsyncStorage,
};

const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current', 'currentCart', 'cart'],
    key: 'user',
};

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: persistReducer(userConfig, userSlice),
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        })
            .concat(alertMiddleware)
            .concat(modalMiddleware),
});

export const persistor = persistStore(store);
