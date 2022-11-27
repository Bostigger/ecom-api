const express = require('express')
const {createOrder, getSingleOrder, getAllOrders, updateOrder, getCurrentUserOrders, deleteOrder} = require("../controllers/orderController");
const {authenticateUser, authorizeUser} = require("../middlewares/authentication");
const router = express.Router()

router.route('/new-order').post(authenticateUser,createOrder)
router.route('/all').get(authenticateUser,authorizeUser('admin'),getAllOrders)
router.route('/user/').get(authenticateUser,getCurrentUserOrders)
router.route('/:id').get(authenticateUser,authorizeUser('admin'),getSingleOrder).patch(authenticateUser,updateOrder).delete(authenticateUser,authorizeUser('admin'),deleteOrder)

module.exports = router
