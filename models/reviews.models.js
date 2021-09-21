const db = require("../db/connection")
const format = require("pg-format")

exports.selectReviews = async (sort_by = "created_at") => {
  const queryStr = format(
    `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY %I
  `,
    sort_by
  )
  const reviews = await db.query(queryStr)
  return reviews.rows
}
