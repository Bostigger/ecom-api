const User = require('../models/user')
const bcrypt = require('bcryptjs')
const createTokenUser = require("../utils/createTokenUser");
const {attachCookiesToResponse} = require("../utils");
const checkPermission = require("../utils/checkPermission");

const getAllUsers = async(req,res) => {
  try{
     const allUsers = await User.find({role:'user'}).select('-password')
      if(allUsers.length<0){
          return res.status(200).json({message:'No users found'})
      }
     res.status(200).json({uses:allUsers,total:allUsers.length})
  }catch (e) {

      console.log(e)
  }
}

const getSingleUser = async (req,res) => {
  try{
      console.log(req.user)
      const {id}= req.params
      const singleUser = await User.findOne({_id:req.params.id}).select('-password')
      if(!singleUser){
          return res.status(200).json({message:`No user with ${id} found`})
      }
      const checkPerm = checkPermission(req.user,singleUser._id)
      if(!checkPerm){
          return res.status(401).json({message:`Authorized to view this information`})
      }
      res.status(200).json({uses:singleUser})
  }catch (e) {
      const {id}= req.params
      if (e.name === 'CastError') {
          return res.status(200).json({message:`No user with ${id} found`})
      }
      console.log(e)
  }
}

const showCurrentUser = async (req,res) => {
  try{
      res.status(200).json({user:req.user})
  }catch (e) {
      console.log(e)
  }
}


const updateUser = async (req,res)=>{
    try {
        const {email,name} = req.body
        const oldMail = req.user.email
        console.log(oldMail)
        if(email){
            req.body.email = email.toLowerCase()
        }
        const updatedUser = await User.findOneAndUpdate({email:oldMail},{email,name},{
            new:true,
            runValidators:true
        })

       const payload = ({userId:updatedUser._id,email:updatedUser.email,name:updatedUser.name,role:updatedUser.role})
       attachCookiesToResponse({res,user:payload})
       res.status(201).json({message:'Profile successfully updated'})
    }catch (e) {
        console.log(e)
    }
}

const updateUserPassword = async (req,res) => {
  try{
      const email = req.user.email
      const user = await User.findOne({email:email})
      const {oldPassword,newPassword,confirmPassword} = req.body

      const oldPwdMatch = await user.comparePassword(oldPassword)
      if(!oldPassword || !newPassword || !confirmPassword){
          return res.status(400).json({message:'provide all necessary information '})
      }
      if(oldPassword==='' ||newPassword==='' || confirmPassword===''){
          return res.status(400).json({message:'provide all necessary information '})
      }
      if(!oldPwdMatch){
          return res.status(400).json({message:'Current Password is not correct'})
      }
      if(newPassword!==confirmPassword){
          return res.status(400).json({message:'Password confirmation does not match'})
      }
      const salt = await bcrypt.genSalt(10)
      const newHashedPassword = await bcrypt.hash(newPassword,salt)
      await User.findOneAndUpdate({email}, {password:newHashedPassword},{
          new:true,
          runValidators:true
      })
      console.log(req.body)
      res.status(201).json({message:'Password successfully updated'})
  }catch (e) {
      console.log(e)
  }
}

module.exports = {getAllUsers,getSingleUser,updateUser,updateUserPassword,showCurrentUser}