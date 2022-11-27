const mongoose = require('mongoose')

const singleCartItem = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:String,required:true},
    amount:{type:String,required:true},
    product:{type:String,required:true},
})

const orderSchema = new mongoose.Schema({
    tax:{
        type:Number,
        required:true
    },
    shippingFee:{
        type:Number,
        required: true,
    },
    subtotal:{
        type:Number,
        required: true
    },
    total:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        enum:['Pending','Paid','Canceled','Processing','Confirmed','Delivered'],
        default:'Pending',
        required:true,
    },
    clientSecret:{
        type:String,
        required:true,
    },
    paymentId:{
        type:String
    },
    orderItems:[singleCartItem],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})


module.exports = new mongoose.model('Order',orderSchema)