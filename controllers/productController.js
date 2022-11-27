const Product = require('../models/product')
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Review = require('../models/review')
const createProduct = async (req,res) => {
  try{
      req.body.user = req.user.userId
      const product = await Product.create({...req.body})
      res.status(201).json({data:product})
  }catch (e) {
      res.status(400).json({message:e.message})
  }
}

const getAllProducts = async(req,res) => {
  try{
     const allProducts = await Product.find({})
      res.status(200).json({allProducts,total:allProducts.length})
  }catch (e) {
      console.log(e)
  }
}

const getSingleProduct = async(req,res) => {
  try{
      const {id} = req.params
      const singleProduct = await Product.findOne({_id:id}).populate('reviews')
      if(!singleProduct){
          return res.status(200).json({message:`No product with ${id} found`})
      }
    res.status(200).json({singleProduct})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(200).json({message:`No product with ${id} found`})
      }
      console.log(e)
  }
}

const updateProduct = async (req,res) => {
  try{
      const {id} = req.params
      const singleProduct = await Product.findOne({_id:id})
      if(!singleProduct){
          return res.status(200).json({message:`No product with ${id} found`})
      }
      if((singleProduct.user).toString() !== req.user.userId){
          return res.status(401).json({message:'Denied.You didnt upload this product!'})
      }
     const updatedProduct = await Product.findOneAndUpdate({_id:id},req.body,{
         new:true,
         runValidators:true
     })
      res.status(200).json({updatedProduct})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(200).json({message:`No product with ${id} found`})
      }
      console.log(e)
  }
}

const deleteProduct = async(req,res) => {
  try{
      const {id} = req.params
      const singleProduct = await Product.findOne({_id:id})
      if(!singleProduct){
          return res.status(404).json({message:`No product with ${id} found`})
      }
      if((singleProduct.user).toString() !== req.user.userId){
          return res.status(403).json({message:`Denied. You didnt upload this product`})
      }
      await Product.findOneAndDelete({_id:id})
      await  Review.deleteMany({product:id})
      res.status(200).json({message:'Product successfully deleted'})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(200).json({message:`No product with ${id} found`})
      }
      console.log(e)
  }
}

const uploadProductImage = async (req,res)=>{
    try{
        if(!req.files){
            return res.status(404).json({message:`No image selected`})
        }
        if(!req.files.image.mimetype.startsWith('image')){
            return res.status(404).json({message:`Please upload only images`})
        }
        const maxSize = 1024 * 1024
        if(req.files.image.size > maxSize){
            return res.status(404).json({message:`Please upload images less than 1MB`})
        }

        const {id} = req.params
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
            use_filename:true,
            folder:'product_images'
        })
        const singleImage = await Product.findOne({_id:id})
        if(!singleImage){
            return res.status(404).json({message:`Product with ${id} not found`})
        }
        const updatedProduct = await  Product.findOneAndUpdate({_id:id},{image:result.secure_url},{
            new:true,
            runValidators:true,
        })
       fs.unlinkSync(req.files.image.tempFilePath)
        return res.status(200).json({updatedProduct})
    }catch (e) {
        const {id}= req.params
        if (e.name === 'CastError') {
            return res.status(200).json({message:`No product with ${id} found`})
        }
        console.log(e)
    }
}

const getSingleProductWithReviews = async (req,res) => {
  try{
     const {id} = req.params
     const checkProduct = await Product.findOne({_id:id})
     if(!checkProduct){
         return res.status(404).json({message:`No product found`})
     }
     const reviewCheck = await Review.findOne({product:id})
      if(!reviewCheck){
          return res.status(404).json({message:`Product has no reviews yet!`})
      }
      const allReviews = await Review.find({product:id})
      res.status(200).json({reviews:allReviews})

  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(200).json({message:`No product with ${id} found`})
      }
      console.log(e)
  }
}

module.exports = {createProduct,getSingleProduct,getAllProducts,deleteProduct,updateProduct,uploadProductImage,getSingleProductWithReviews}