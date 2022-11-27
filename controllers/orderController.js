const Product = require('../models/product')
const Order = require('../models/order')


const FakeStripeApi = ({amount, currency}) => {
    const client_secret = "RandomStripeClientSecretKey"
    return {client_secret, amount}
}
const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find({})
        res.status(200).json({allOrders})
    } catch (e) {
        console.log(e)
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const {id} = req.params
        const singleOrder = await Order.findOne({_id:id})
        if(!singleOrder){
            return res.status(404).json({message:`No order with ${id} found `})
        }
        res.status(200).json({singleOrder})
    } catch (e) {
        const {id} = req.params
        if(e.name==='CastError'){
            return res.status(404).json({message:`No such item with id ${id} found`})
        }
        console.log(e)
    }
}

const getCurrentUserOrders = async (req, res) => {
    try {

        const userOrder = await Order.find({user:req.user.userId})
        if(!userOrder){
            return res.status(404).json({message:'No orders found'})
        }
        res.status(200).json({orders:userOrder,total:userOrder.length})
    } catch (e) {
        console.log(e)
    }
}

const createOrder = async (req, res) => {
    try {
        const {tax, shippingFee, items} = req.body
        if (!tax || !shippingFee || !items) {
            return res.status(400).json({message: 'Missing fields'})
        }
        if (!items || items.length < 1) {
            return res.status(400).json({message: 'No cart items found'})
        }

        let orderItems = []
        let subtotal = 0.0

        for (const item of items) {
            const checkProduct = await Product.findOne({_id: item.product})
            if (!checkProduct) {
                return res.status(404).json({message: `No product with ${item.product} found`})
            }
            const {name, price, image, _id} = checkProduct
            const singleOrderItem = {
                name, price, image, product: _id, amount: item.amount
            }
            orderItems = [...orderItems, singleOrderItem]
            subtotal += price * item.amount
        }
        const grandTotal = subtotal + tax + shippingFee

        const paymentIntent = FakeStripeApi({
            amount: grandTotal,
            currency: 'usd'
        })

        const newOrder = await Order.create({
            tax,
            shippingFee,
            subtotal,
            total: grandTotal,
            clientSecret: paymentIntent.client_secret,
            orderItems,
            user: req.user.userId
        })
      res.status(201).json({message:'Order successfully placed',newOrder})
    } catch (e) {
        return res.status(404).json({message: 'Cant place order.Check information provided'})
        // console.log(e)
    }
}

const updateOrder = async (req, res) => {
    try {
        const {id} = req.params
        const {paymentIntentId} = req.body
        const orderCheck = await Order.findOne({_id:id})
        if(!orderCheck){
            return res.status(404).json({message:`No order with ${id} found`})
        }
        if(!paymentIntentId){
            return res.status(400).json({message:`Order paymentId required`})
        }
        if((orderCheck.user).toString() !== req.user.userId && req.user.role !=='admin'){
            return res.status(404).json({message:`No permission to update order`})
        }
        orderCheck.paymentId = paymentIntentId
        orderCheck.status = "Paid"
        await orderCheck.save()
        res.status(200).json({message:'Order successfully updated',orderCheck})
    } catch (e) {
        const {id} = req.params
        if(e.name==='CastError'){
            return res.status(404).json({message:`No such item with id ${id} found`})
        }
        console.log(e)
    }
}

const deleteOrder = async (req, res) => {
    try {
        const {id} = req.params
        const orderCheck = await Order.findOne({_id:id})
        if(!orderCheck){
            return res.status(404).json({message:`No order with ${id} found`})
        }
        await Order.findOneAndDelete({_id:id})
       res.status(200).json({message:'Order successfully deleted'})
    } catch (e) {
        const {id} = req.params
        if(e.name==='CastError'){
            return res.status(404).json({message:`No such item with id ${id} found`})
        }
        console.log(e)
    }
}

module.exports = {updateOrder, createOrder, getAllOrders, getSingleOrder, getCurrentUserOrders, deleteOrder}