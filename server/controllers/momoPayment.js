const axios = require('axios');
const crypto = require('crypto');

const config = {
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    orderInfo: 'pay with MoMo',
    partnerCode: 'MOMO',
    redirectUrl: '',
    ipnUrl: 'https://192.168.1.7:5000/callback',
    requestType: 'payWithMethod',
    extraData: '',
    orderGroupId: '',
    autoCapture: true,
    lang: 'vi',
};

const createPayment = async (req, res) => {
    let {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        redirectUrl,
        ipnUrl,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        lang,
    } = config;

    const { amount } = req.body;
    if (!amount) {
        return res
            .status(200)
            .json({ success: false, message: 'Amount is required' });
    }

    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;

    var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;

    var signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });

    let result;
    try {
        result = await axios({
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        });
        return res.status(200).json(result.data);
    } catch (error) {
        return res
            .status(500)
            .json({ statusCode: 500, message: error.message });
    }
};

const checkOrderStatus = async (req, res) => {
    let { orderId } = req.body;

    if (!orderId) {
        return res
            .status(200)
            .json({ success: false, message: 'orderId is required' });
    }

    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    try {
        const result = await axios({
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        });

        return res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Failed to check order status',
            error,
        });
    }
};

module.exports = {
    createPayment,
    checkOrderStatus,
};
