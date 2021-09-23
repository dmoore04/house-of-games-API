const reviewsRouter = require("express").Router()
const {
  sendReviews,
  sendReview,
  patchReview,
  sendReviewComments,
} = require("../controllers/reviews.controllers")

reviewsRouter.get("/", sendReviews)
reviewsRouter.route("/:review_id").get(sendReview).patch(patchReview)
reviewsRouter.get("/:review_id/comments", sendReviewComments)

module.exports = reviewsRouter
