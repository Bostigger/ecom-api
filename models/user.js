const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minLength:3
    },
    email:{
        type:String,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique:true,
        required:[true,'Please provide email'],
    },

    password:{
        type:String,
        minLength: 6,
        required:[true,'Please provide password'],
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    verificationToken:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verified:{
        type:Date
    },
    passwordToken:{
        type:String
    },
    passwordTokenExpirationDate:{
        type:Date
    }


})

userSchema.pre('save',async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.email = this.email.toLowerCase()
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}
//
// userSchema.methods.generateToken = async function () {
//     return await jwt.sign({
//         userId: this._id,
//         email: this.email,
//         role:this.role
//     }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
// }


module.exports = mongoose.model('User',userSchema)