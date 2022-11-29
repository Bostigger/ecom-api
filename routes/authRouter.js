const express = require('express')
const {loginUser, registerUser, logoutUser, forgotPassword, resetPassword} = require("../controllers/authController");
const verifyEmail = require("../controllers/verifyController");
const {authenticateUser} = require("../middlewares/authentication");
const router = express.Router()

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)
router.route('/logout').delete(authenticateUser,logoutUser)
router.route('/verify-email').post(verifyEmail)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)


module.exports = router