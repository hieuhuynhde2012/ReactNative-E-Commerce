const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

const createPayment = async (req, res) => {
    const embed_data = {
        redirecturl: '',
    };

    const { amount } = req.body;

    if (!amount) {
        return res
            .status(200)
            .json({ success: false, message: 'Amount is required' });
    }

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        callback_url:
            'https://a31a-2402-800-6388-30bc-8c7f-1f73-be1a-1e80.ngrok-free.app/api/zalo-payment/callback',
        description: `Digital World - Payment for the order #${transID}`,
        bank_code: '',
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, {
            params: order,
        });

        if (result?.data) {
            result.data.app_trans_id = order?.app_trans_id;
        }

        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment creation failed', error });
    }
};

const paymentCallback = (req, res) => {
    const result = {};
    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;
        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'Invalid MAC';
        } else {
            const dataJson = JSON.parse(dataStr);
            console.log(
                `Update order status: success, where app_trans_id = ${dataJson.app_trans_id}`,
            );
            result.return_code = 1;
            result.return_message = 'Success';
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
};

const checkOrderStatus = async (req, res) => {
    const { app_trans_id } = req.body;

    const postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios({
            method: 'POST',
            url: 'https://sb-openapi.zalopay.vn/v2/query',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify(postData),
        });
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to check order status',
            error,
        });
    }
};

module.exports = {
    createPayment,
    paymentCallback,
    checkOrderStatus,
};
