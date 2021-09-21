const { selectReviews } = require("../models/reviews.models")

exports.sendReviews = async (req, res, next) => {
  try {
    const { sort_by } = req.query
    const reviews = await selectReviews(sort_by)
    res.status(200).send({ reviews })
  } catch (err) {
    next(err)
  }
}
