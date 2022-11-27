const express = require('express')
const {getAllProducts, getSingleProduct, updateProduct, createProduct, uploadProductImage, deleteProduct,
    getSingleProductWithReviews
} = require("../controllers/productController");
const {authenticateUser, authorizeUser} = require("../middlewares/authentication");
const router = express.Router()

router.route('/get-products').get(getAllProducts)
router.route('/new-product').post(authenticateUser,authorizeUser('admin'),createProduct)
router.route('/product-reviews/:id').get(getSingleProductWithReviews)
router.route('/upload-image/:id').patch(authenticateUser,authorizeUser('admin'),uploadProductImage)
router.route('/:id').get(getSingleProduct).patch(authenticateUser,authorizeUser('admin'),updateProduct).delete(authenticateUser,authorizeUser('admin'),deleteProduct)


module.exports = router

