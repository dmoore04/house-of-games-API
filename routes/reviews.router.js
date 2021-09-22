const reviewsRouter = require("express").Router()
const {
  sendReviews,
  sendReview,
  patchReview,
} = require("../controllers/reviews.controllers")

reviewsRouter.get("/", sendReviews)
reviewsRouter.route("/:review_id").get(sendReview).patch(patchReview)
module.exports = reviewsRouter
