const db = require("../db/connection")
const format = require("pg-format")

exports.selectReviews = async (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  let queryStr = `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews LEFT JOIN comments 
    ON reviews.review_id = comments.review_id
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

exports.selectReviewById = async (review_id) => {
  const review = await db.query(
    `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews LEFT JOIN comments 
    ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;`,
    [review_id]
  )

  if (review.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No data found" })
  }

  return review.rows[0]
}
