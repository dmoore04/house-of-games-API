const {
  selectReviews,
  selectReviewById,
  updateReview,
} = require("../models/reviews.models")

exports.sendReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query
    const reviews = await selectReviews(sort_by, order, category)
    res.status(200).send({ reviews })
  } catch (err) {
    next(err)
  }
}

exports.sendReview = async (req, res, next) => {
  try {
    const { review_id } = req.params
    const review = await selectReviewById(review_id)
    res.status(200).send({ review })
  } catch (err) {
    next(err)
  }
}

exports.patchReview = async (req, res, next) => {
  try {
    const { review_id } = req.params
    const { inc_votes } = req.body
    const updatedReview = await updateReview(review_id, inc_votes)
    res.status(201).send({ review: updatedReview })
  } catch (err) {
    next(err)
  }
}
