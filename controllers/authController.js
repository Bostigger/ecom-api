const User = require('../models/user')
const {attachCookiesToResponse} = require("../utils");
const loginUser = async(req,res) => {
  try{
      const {email,password} = req.body
      if (email === '' || password === '') {
          return res.status(400).json({message: 'Provide all fields'})
      }
      if (!email || !password) {
          return res.status(400).json({message: 'Provide all fields'})
      }
      const user = await User.findOne({email})
      if(!user){
          return res.status(401).json({message: 'Email is not found'})
      }
      const checkPwd = await user.comparePassword(password)
      console.log(checkPwd)
      if(!checkPwd){
          return res.status(401).json({message: 'Password is not  correct'})
      }
      const payload = ({userId:user._id,email:user.email,name:user.name,role:user.role})
      attachCookiesToResponse({res,user:payload})
     res.status(200).json({message:"User successfully login" ,payload})
  }catch (e) {
      console.log(e)
  }
}
const registerUser = async (req,res) => {
     try {
         const {name, email, password} = req.body
         if (name === '' || email === '' || password === '') {
             return res.status(400).json({message: 'Provide all fields'})
         }
         if (!name || !email || !password) {
             return res.status(400).json({message: 'Provide all fields'})
         }
         const checkEmail = await User.findOne({email: email})
         if (checkEmail) {
             return res.status(400).json({message: 'Email already taken'})
         }

         const newUser = await User.create({...req.body})

         const payload = {userId: newUser._id,email: newUser.email,name:newUser.name,role:newUser.role}

         attachCookiesToResponse({res,user:payload})

         res.status(201).json({user: newUser})

     }catch (e) {
         if(e['errors']['password']){
             return res.json({message: e['errors']['password']['message']})
         }else if(e['errors']['email']){
             return res.json({message: e['errors']['email']['message']})
         }
        return res.json(e)
         //console.log(e)
     }
}

const logoutUser= async(req,res) => {
  try {
     res.cookie('token','logout',{
         expires:new Date(Date.now()),
         httpOnly:true
     })
      res.status(200).json({message:'User successfully logout'})
  }catch (e) {
      console.log(e)
  }
}
module.exports = {loginUser,registerUser,logoutUser}