const jwt = require('jsonwebtoken')
const {verifyToken} = require("../utils");
require('dotenv').config()

const authenticateUser = async (req,res,next) =>{
   const token = req.signedCookies.token
    if(token){
        try {
            console.log(token)
            const decodedToken = await verifyToken({token})
            req.user = {userId:decodedToken.userId,email:decodedToken.email,role:decodedToken.role,name:decodedToken.name}
            console.log(decodedToken)
        }catch (e) {
            console.log(e)
        }
    }else{
       return res.status(401).json({message:'Please login first'})
    }
    next()
}

const authorizeUser = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:'Unauthorized to view this page'})
        }
        next()
    }
}

module.exports = {authenticateUser,authorizeUser}