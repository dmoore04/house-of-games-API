const db = require("../db/connection")
const format = require("pg-format")

exports.selectReviews = async (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  let queryStr = `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
  `

  const queryValues = []
  if (category) {
    queryStr += `WHERE category = $1`
    queryValues.push(category)
  }

  queryStr += format(
    `
  GROUP BY reviews.review_id
  ORDER BY %I ${order}`,
    [sort_by]
  )

  const reviews = await db.query(queryStr, queryValues)
  return reviews.rows
}
