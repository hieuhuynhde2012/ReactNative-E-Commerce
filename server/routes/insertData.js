const router = require('express').Router();
const ctrls = require('../controllers/insertData');

router.post('/', ctrls.insertProduct);
router.post('/category', ctrls.insertProductCategory);


module.exports = router;