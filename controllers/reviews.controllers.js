const { selectReviews } = require("../models/reviews.models")

exports.sendReviews = async (req, res, next) => {
  try {
    const reviews = await selectReviews()
    res.status(200).send({ reviews })
  } catch (err) {
    next(err)
  }
}
