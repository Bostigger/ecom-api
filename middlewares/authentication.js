const jwt = require('jsonwebtoken')
const {verifyToken, attachCookiesToResponse} = require("../utils");
const Token = require('../models/token')
require('dotenv').config()

const authenticateUser = async (req,res,next) =>{
    const {accessToken,refreshToken} = req.signedCookies
    try {
     if(accessToken){
            const decodedToken = verifyToken(accessToken)
            req.user = decodedToken.user
            return next()
        }
        console.log('we are here')
        const decodedToken = verifyToken(refreshToken)
        const checkTokenExistence =  await Token.findOne({user:decodedToken.user.userId,refreshToken:decodedToken.refreshToken})
        console.log(checkTokenExistence)

        if(!checkTokenExistence || !checkTokenExistence?.isValid){
            return res.status(401).json({message:'Authentication Failed'})
        }
        attachCookiesToResponse({res,user:decodedToken.user,refreshToken:checkTokenExistence.refreshToken})
        req.user = decodedToken.user
        next()
    }catch (e) {
        console.log(e)
    }
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