const jwt = require("jsonwebtoken");

const generateToken = ({payload}) =>{
    return jwt.sign(payload,process.env.JWT_SECRET)
}

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({res,user,refreshToken}) => {
  const accessTokenJWT = generateToken({payload: {user}})
  const refreshTokenJWT = generateToken({payload: {user,refreshToken}})

  const cookiesExpiryRefresh = 1000 * 60 * 60 *720
  const cookiesExpiryAccess = 1000 * 60 * 60 *24

  res.cookie('accessToken',accessTokenJWT,{
      httpOnly:true,
      signed:true,
      secure:process.env.NODE_ENV==='production',
      maxAge:cookiesExpiryAccess
  })

    res.cookie('refreshToken',refreshTokenJWT,{
        httpOnly:true,
        signed:true,
        secure:process.env.NODE_ENV==='production',
        expires:new Date(Date.now() + cookiesExpiryRefresh)
    })

}
/*const attachSingleCookieToResponse = ({res,user}) => {
    const token = generateToken({payload:user})
    const cookiesExpiry = 1000 * 60 * 60 *720
    res.cookie('token',token,{
        httpOnly:true,
        signed:true,
        secure:process.env.NODE_ENV==='production',
        expires:new Date(Date.now() + 5000)
    })

}
*/


module.exports = {generateToken,verifyToken,attachCookiesToResponse}