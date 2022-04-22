const router = require('express').Router();
const { 
    createProduct, getProductCategories, getProduct,
    updateProductDetails, deleteProduct
    } = require('../controllers/ProductsController');


// routes
router.get('/',getProduct)
router.post('/create',createProduct)
router.get('/categories',getProductCategories)
router.put('/update',updateProductDetails)
router.post('/delete',deleteProduct)

module.exports = router;