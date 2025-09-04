const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
10
const { auth, adminOnly } = require('../middlewares/auth');
router.post('/', auth, adminOnly, productController.createProduct);
router.get('/', productController.listProducts);
router.patch('/:id', auth, adminOnly, productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);
module.exports = router;