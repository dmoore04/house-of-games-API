const db = require("../db/connection")
const reviewsRouter = require("../routes/reviews.router")

exports.selectReviews = async () => {
  const queryStr = `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  `
  const reviews = await db.query(queryStr)
  return reviews.rows
}
