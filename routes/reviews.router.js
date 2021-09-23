const reviewsRouter = require("express").Router()
const {
  sendReviews,
  sendReview,
  patchReview,
  sendReviewComments,
  postReviewComment,
} = require("../controllers/reviews.controllers")

reviewsRouter.get("/", sendReviews)
reviewsRouter.route("/:review_id").get(sendReview).patch(patchReview)
reviewsRouter
  .route("/:review_id/comments")
  .get(sendReviewComments)
  .post(postReviewComment)

module.exports = reviewsRouter
