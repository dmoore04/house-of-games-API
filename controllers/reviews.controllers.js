const { selectReviews } = require("../models/reviews.models")

exports.sendReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query
    const reviews = await selectReviews(sort_by, order, category)
    res.status(200).send({ reviews })
  } catch (err) {
    next(err)
  }
}
