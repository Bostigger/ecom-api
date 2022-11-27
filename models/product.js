const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product name required'],
        minLength:3
    },
    price:{
        type:Number,
        required: [true,'Please provide product price']
    },
    description:{
        type:String,
        required:[true,'Product description required'],
        minLength:3
    },
    image:{
        type:String,
        default:'/uploads.test.jpg'
    },
    category:{
        type:String,
        required:[true,'Product description required'],
        enum:['office','bedroom','kitchen'],
    },
    colors:{
        type:[String],
        required:[true,'Product colors required'],
        default:['#222']
    },
    featured:{
        type:Boolean,
        default: false
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        default:10
    },
    averageRating:{
        type:Number,
        default:0.0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

productSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false,
    //match:{rating:5}
})

module.exports = new mongoose.model('Product',productSchema)