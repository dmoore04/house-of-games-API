const db = require("../db/connection")
const format = require("pg-format")
const { reject } = require("../errors/utils")

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
  // SQL Injection???
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

  if (review.rows.length === 0) return reject(404, "No data found")

  return review.rows[0]
}

exports.updateReview = async (review_id, inc_votes = 0) => {
  const updatedReview = await db.query(
    `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`,
    [inc_votes, review_id]
  )

  if (updatedReview.rows.length === 0) return reject(404, "No data found")

  return updatedReview.rows[0]
}
