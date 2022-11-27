const jwt = require("jsonwebtoken");

const generateToken = ({payload}) =>{
    return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

const verifyToken = ({token})=>{
    return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({res,user}) => {
  const token = generateToken({payload:user})
  const cookiesExpiry = 1000 * 60 * 60 *720
  res.cookie('token',token,{
      httpOnly:true,
      signed:true,
      secure:process.env.NODE_ENV==='production',
      expires:new Date(Date.now() + cookiesExpiry)
  })

}


module.exports = {generateToken,verifyToken,attachCookiesToResponse}