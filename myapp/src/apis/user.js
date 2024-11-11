import axios from '../config/axios';

export const apiRegister = (data) => {
    return axios({
        url: '/user/register',
        method: 'post',
        data,
    });
};

export const apiCompleteRegister = (token) =>
    axios({
        url: '/user/completeregister/' + token,
        method: 'put',
    });

export const apiLogin = (data) =>
    axios({
        url: '/user/login',
        method: 'post',
        data,
    });

export const apiForgotPassword = (data) =>
    axios({
        url: '/user/forgotpassword',
        method: 'post',
        data,
    });

export const apiResetPassword = (data) =>
    axios({
        url: '/user/resetpassword',
        method: 'put',
        data,
    });

export const apiGetCurrent = () =>
    axios({
        url: '/user/current',
        method: 'get',
    });

export const apiGetUsers = (params) =>
    axios({
        url: '/user/',
        method: 'get',
        params,
    });

export const apiUpdateUsers = (data, uid) =>
    axios({
        url: '/user/' + uid,
        method: 'put',
        data,
    });

export const apiDeleteUsers = (uid) =>
    axios({
        url: '/user/' + uid,
        method: 'delete',
    });

export const apiUpdateCurrent = (data) =>
    axios({
        url: '/user/current',
        method: 'put',
        data,
    });

export const apiUpdateCart = (data) =>
    axios({
        url: '/user/cart',
        method: 'put',
        data,
    });

export const apiRemoveCart = (pid, color) =>
    axios({
        url: `/user/remove-cart/${pid}/${color}`,
        method: 'delete',
    });

export const apiUpdateWishlist = (pid) =>
    axios({
        url: `/user/wishlist/` + pid,
        method: 'put',
    });
export const apiAddAdditionalAddress = (data) => {
    return axios({
        url: '/user/additional-address',
        method: 'post',
        data,
    });
};

export const apiGetAdditionalAddress = (_id) => {
    return axios({
        url: `/user/additional-address/${_id}`,
        method: 'get',
    });
};

export const apiDeleteAdditionalAddress = (addressId) => {
    return axios({
        url: `/user/additional-address/${addressId}`,
        method: 'delete',
    });
};

export const apiEditAdditionalAddress = (addressId, data) => {
    return axios({
        url: `/user/edit-address/${addressId}`,
        method: 'put',
        data,
    });
};

export const apiSetDefaultAddress = (addressId) => {
    return axios({
        url: `/user/set-default/${addressId}`,
        method: 'put',
    });
};