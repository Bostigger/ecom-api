const Review = require('../models/review')
const Product = require('../models/product')
const createReview = async (req,res) => {
  try{
      const {title,comment,rating,product} = req.body

      if(!product || !title || !comment || !rating){
          return res.status(400).json({message:'Provide all fields'})
      }
      const productCheck = await Product.findOne({_id:product})
      if(!productCheck){
          return res.status(400).json({message:'Product not found'})
      }
      const checkReviewExistence = await Review.findOne({product:product,user: req.user.userId})
      if(checkReviewExistence){
          return res.status(401).json({message:'Review already submitted'})
      }
      req.body.user = req.user.userId
      const review = await Review.create({...req.body})
      res.status(201).json({message:'Review created successfully',review})
  }catch (e) {
      console.log(e)
  }
}

const getAllReviews = async (req,res) => {
  try{
      const allReviews = await Review.find({}).populate({path:'product',select:'name price company image'})
      res.status(200).json({allReviews})

  }catch (e) {
      console.log(e)
  }
}

const getSingleReview = async (req,res) => {
  try{
      const {id} = req.params
      const singleReview = await Review.findOne({_id:id})
      if(!singleReview){
          return res.status(404).json({message:`Review with ${id} not found `})
      }
     res.status(200).json({singleReview})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(404).json({message:`No product with ${id} found`})
      }
      console.log(e)
  }
}

const updateReview = async (req,res) => {
  try {
      const {product} = req.body
      if(product){
          const checkProduct  = await Review.findOne({product:req.body.product})

          if(!checkProduct){
              console.log('hi')
              return res.status(404).json({message:`No product found`})
          }
      }
      const reviewCheck = await Review.findOne({_id:req.params.id})
      if(!reviewCheck){
          return res.status(404).json({message:`No review found`})
      }
      const updatedReview = await Review.findOneAndUpdate({_id:req.params.id},req.body,{
          new:true,
          runValidators:true
      })
      res.status(201).json({message:'Review updated successfully',updatedReview})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(404).json({message:`No product / review found`})
      }
      console.log(e)
  }
}

const deleteReview = async(req,res) => {
  try{
      const review = await Review.findOne({_id:req.params.id})
      console.log(req.user.role)
      console.log((review.user).toString())
      console.log(req.user.userId)
      if(!review){
          return res.status(404).json({message:`Review with ${req.params.id} not found`})
      }
      if(req.user.role !== 'admin' && (review.user).toString() !== req.user.userId ){
          return res.status(200).json({message:`You cant delete this review`})
      }
      await Review.findOneAndDelete({_id:req.params.id})
      res.status(200).json({message:`Review successfully deleted`})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(404).json({message:`No review found`})
      }
      console.log(e)
  }
}

module.exports = {createReview,getAllReviews,getSingleReview,updateReview,deleteReview}