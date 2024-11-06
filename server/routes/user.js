const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require("../config/cloudinary.config");

router.post('/register', ctrls.register);
router.post('/mock', ctrls.createUsers);
router.put('/completeregister/:token', ctrls.completeRegister);
router.post('/login', ctrls.login);
router.get('/current', verifyAccessToken, ctrls.getCurrent);
router.post('/refreshtoken', ctrls.refreshAccessToken);
router.get('/logout', ctrls.logout);
router.post('/forgotpassword', ctrls.forgotPassword);
router.put('/resetpassword', ctrls.resetPassword);
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers);
router.put('/current', verifyAccessToken, uploader.single('avatar'), ctrls.updateUser);
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress);
router.post('/additional-address', [verifyAccessToken], ctrls.addAdditionalAddress);
router.get('/additional-address/:_id', [verifyAccessToken], ctrls.getAdditionalAddress);
router.put('/cart', [verifyAccessToken], ctrls.updateUserCart);
router.delete('/remove-cart/:pid/:color', [verifyAccessToken], ctrls.removeProductFromCart);
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put('/wishlist/:pid', [verifyAccessToken], ctrls.updateWishlist);
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);





module.exports = router;