const router = require('express').Router();
const ctrls = require('../controllers/order');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// router.post('/', [verifyAccessToken], ctrls.createOrder);
router.post('/', [verifyAccessToken], ctrls.createNewOrder);
router.put(
    '/status/:oid',
    [verifyAccessToken, isAdmin],
    ctrls.updateOrderStatus,
);
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrders);
router.get('/', [verifyAccessToken], ctrls.getUserOrder);

module.exports = router;
