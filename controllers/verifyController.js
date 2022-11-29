const User = require('../models/user')
const verifyEmail = async(req,res) => {
  try{
      const {verificationToken,email} = req.body
      if(!verificationToken || !email){
          return res.status(404).json({message:'Provide email and verification token'})
      }
      const userCheck = await User.findOne({email})
      if(!userCheck){
          return res.status(404).json({message:'User with that email not found'})
      }
      if(userCheck.verificationToken===''){
          return res.status(404).json({message:'Email already verified'})
      }
      if(verificationToken !== userCheck.verificationToken){
          return res.status(404).json({message:'Invalid email verification link'})
      }
      await User.findOneAndUpdate({email},{isVerified:true,verified:Date.now(),verificationToken:''},{
          new:true,
          runValidators:true
      })
      res.status(200).json({message:'Email successfully verified. Login now'})
  }catch (e) {
      console.log(e)
  }
}

module.exports = verifyEmail