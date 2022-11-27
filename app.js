const express = require('express')
const ConnectDb = require("./connect/connect");

//Router
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const productRouter= require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRouter')
const orderRouter = require('./routes/orderRouter')

//third party middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const cookieParser = require("cookie-parser");
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

//cloudinary V2 usage
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const app = express()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET

})
//middlewares
app.set('trust-proxy',1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan('tiny'))
app.use(fileUpload({useTempFiles:true}))


app.use(express.static('./public'))

//routes


app.use('/api/v2/auth/',authRouter)
app.use('/api/v2/user/',userRouter)
app.use('/api/v2/product/',productRouter)
app.use('/api/v2/review/',reviewRouter)
app.use('/api/v2/order/',orderRouter)



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000

const startConnection = async () => {
  try {
      await ConnectDb(process.env.MONGO_URI)
      app.listen(port,()=>console.log(`Server is running on port ${port}`))
  }catch (e) {
      console.log(e)
  }
}

startConnection()

