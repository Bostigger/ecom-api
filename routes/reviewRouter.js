const express = require('express')
const {createReview, getAllReviews, updateReview, deleteReview, getSingleReview} = require("../controllers/reviewController");
const {authenticateUser, authorizeUser} = require("../middlewares/authentication");
const router = express.Router()

router.route('/create-review').post(authenticateUser,authorizeUser('admin','user'),createReview)
router.route('/get-reviews').get(getAllReviews)
router.route('/:id').patch(authenticateUser,authorizeUser('admin','user'),updateReview).delete(authenticateUser,authorizeUser('admin','user'),deleteReview).get(getSingleReview)


module.exports = router
