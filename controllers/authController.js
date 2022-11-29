const User = require('../models/user')
const {attachCookiesToResponse} = require("../utils");
const crypto = require('crypto')
const Token = require('../models/token')
const sendEmail = require("../utils/sendEmail");
const bcrypt = require('bcryptjs')
const sendVerificationMail = require("../utils/sendVerificationMail");
const sendResetPasswordLink = require("../utils/sendResetPasswordLink");
const hashString = require("../utils/createHash");
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
      if(!user.isVerified){
          return res.status(401).json({message: 'Please verify your email'})
      }

      const payload = ({userId:user._id,email:user.email,name:user.name,role:user.role})

      let refreshToken = ''

      const checkUserToken = await Token.findOne({user:user._id})

      if(checkUserToken){
          refreshToken = checkUserToken.refreshToken
          attachCookiesToResponse({res,user:payload,refreshToken})
          res.status(200).json({message:"User successfully login"})
          return
      }
      refreshToken = crypto.randomBytes(40).toString('hex')
      const userAgent = req.headers['user-agent']
      const ip = req.ip
      const userToken = {refreshToken,userAgent,ip,user:user._id}
      const token = await Token.create(userToken)
     attachCookiesToResponse({res,user:payload,refreshToken})
     res.status(200).json({message:"User successfully login" ,token})
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
         const verificationToken = crypto.randomBytes(40).toString('hex')
         const newUser = await User.create({name,email,password,verificationToken})

         const origin = 'http://localhost:3001/user'
         await sendVerificationMail({name:newUser.name,email:newUser.email,verificationToken:newUser.verificationToken,origin:origin})

         //for the sake of postman testing
         res.status(201).json({message:'Account created. Please check mail to verify account'})

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

      await Token.findOneAndDelete({user:req.user.userId})
     res.cookie('accessToken','logout',{
         expires:new Date(Date.now()),
         httpOnly:true
     })
      res.cookie('refreshToken','logout',{
          expires:new Date(Date.now()),
          httpOnly:true
      })
      res.status(200).json({message:'User successfully logout'})
  }catch (e) {
      console.log(e)
  }
}

const forgotPassword = async (req,res) => {
  try{
      const {email} = req.body
      if(!email){
          return res.status(404).json({message:'Please provide valid email'})
      }
      const userCheck = await User.findOne({email})
      if(userCheck){
          const passwordToken = crypto.randomBytes(90).toString('hex')
          const expiryMinutes = 1000 * 60 * 10
          const passwordTokenExpirationDate = Date.now()+expiryMinutes

          await User.findOneAndUpdate({email},{passwordToken:hashString(passwordToken),passwordTokenExpirationDate},{
              new:true,
              runValidators:true
          })
          const origin = 'http://localhost:3001/auth'
          await sendResetPasswordLink({name:userCheck.name,email:userCheck.email,passwordToken:passwordToken,origin})
      }

    res.status(200).json({message:'Please check your email'})
  }catch (e) {
      console.log(e)
  }
}

const resetPassword = async(req,res) => {
  try{
      const {email,passwordToken,password} = req.body
      if(!email || !passwordToken || !password){
          return res.status(400).json({message:'Please provide all needed information'})
      }
      const userCheck = await User.findOne({email})
      if(!userCheck){
          return res.status(404).json({message:'User not found'})
      }
      if(hashString(passwordToken) !== userCheck.passwordToken){
          return res.status(404).json({message:'Invalid Password Reset Token'})
      }
      if(Date.now() > userCheck.passwordTokenExpirationDate){
          return res.status(404).json({message:'Password Reset link has expired'})
      }
      const salt = await bcrypt.genSalt(10)
      const newPwd = await bcrypt.hash(password,salt)
      await User.findOneAndUpdate({email},{password:newPwd,passwordToken:null,passwordTokenExpirationDate:null},{
          new:true,
          runValidators:true
      })
      res.status(200).json({message:'Password successfully updated'})
  }catch (e) {
      console.log(e)
  }
}
module.exports = {loginUser,registerUser,logoutUser,forgotPassword,resetPassword}