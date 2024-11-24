import axios from '../config/axios';

export const apiZaloCreatePayment = (data) => {
    return axios({
        url: '/zalo-payment/create-payment',
        method: 'post',
        data,
    });
};

export const apiZaloCheckOrderStatus = (data) => {
    return axios({
        url: '/zalo-payment/check-order-status',
        method: 'post',
        data,
    });
};

export const apiMomoCreatePayment = (data) => {
    return axios({
        url: '/momo-payment/create-payment',
        method: 'post',
        data,
    });
};

export const apiMomoCheckOrderStatus = (data) => {
    return axios({
        url: '/momo-payment/check-order-status',
        method: 'post',
        data,
    });
};
