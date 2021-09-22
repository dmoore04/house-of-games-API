const reviewsRouter = require("express").Router()
const {
  sendReviews,
  sendReview,
} = require("../controllers/reviews.controllers")

reviewsRouter.get("/", sendReviews)
reviewsRouter.get("/:review_id", sendReview)
module.exports = reviewsRouter
