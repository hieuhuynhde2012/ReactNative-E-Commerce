const router = require('express').Router();
const ctrls = require('../controllers/momoPayment');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/create-payment', [verifyAccessToken], ctrls.createPayment);
// router.post('/callback', ctrls.paymentCallback);
router.post('/check-order-status', [verifyAccessToken], ctrls.checkOrderStatus);

module.exports = router;
