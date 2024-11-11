import axios from 'axios';
import { API_URI } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'http://192.168.1.7:5000/api',
});

// Add a request interceptor
instance.interceptors.request.use(
    async (config) => {
        try {
            const localStorageData = await AsyncStorage.getItem('persist:user');
            if (localStorageData) {
                const parsedData = JSON.parse(localStorageData);
                const accessToken = JSON.parse(parsedData?.token);

                if (accessToken) {
                    config.headers['authorization'] = `Bearer ${accessToken}`;
                }
            }
        } catch (error) {
            console.error(
                'Error getting access token from AsyncStorage:',
                error,
            );
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error?.response?.data);
    },
);

export default instance;
