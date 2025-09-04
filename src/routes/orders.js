const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');
router.post('/', auth, orderController.placeOrder);
router.get('/my', auth, orderController.getOrdersForUser);
module.exports = router;
        