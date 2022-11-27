const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    rating :{
        type:Number,
        min:1,
        max:5,
        required: [true, 'Please provide rating']
    },
    title:{
        type:String,
        trim:true,
        maxLength:100,
        required:[true,'Provide review title']
    },
    comment:{
        type:String,
        trim: true,
        required:[true,'Provide comment']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: [true, 'Please provide user']
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required: [true, 'Please provide product']
    }
},{timestamps:true})

reviewSchema.statics.getRatings = async function(productId){
    const result = await this.aggregate([
        [
            {
                '$match': {
                    'product': productId
                }
            }, {
            '$group': {
                '_id': '$rating'
            }
        }
        ]
    ])
    console.log(result)
}
reviewSchema.post('save', async function () {
    await this.constructor.getRatings(this.product)
})

module.exports = new mongoose.model('Review',reviewSchema)