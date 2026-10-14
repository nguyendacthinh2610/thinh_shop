const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.get('/create', orderController.showCreateOrder);
router.post('/create', orderController.createOrder);
router.get('/update/:orderId', orderController.showUpdateOrder);
router.post('/update/:orderId', orderController.updateOrder);
router.get('/delete/:orderId', orderController.deleteOrder);
router.post('/delete/:orderId', orderController.deleteOrder);

module.exports = router;
