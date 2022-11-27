const express = require('express')
const {getAllUsers, updateUserPassword, getSingleUser, updateUser, showCurrentUser} = require("../controllers/userController");
const {authenticateUser,authorizeUser} = require("../middlewares/authentication");
const router = express.Router()

router.route('/').get(authenticateUser,authorizeUser('admin','user'),getAllUsers)
router.route('/show-me').get(authenticateUser,showCurrentUser)
router.route('/update-user').patch(authenticateUser,updateUser)
router.route('/update-password').patch(authenticateUser,updateUserPassword)
router.route('/:id').get(authenticateUser,authorizeUser('admin','user'),getSingleUser)

module.exports = router