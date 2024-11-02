import axios from '../config/axios';

export const apiGetCategories = () =>
    axios({
        url: '/productcategory/',
        method: 'get',
    });
