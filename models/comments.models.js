const db = require("../db/connection")
const { reject } = require("../errors/utils")
const { validateId } = require("../models/utils")

exports.selectReviewComments = async (review_id) => {
  if (!(await validateId(review_id, "reviews")))
    return reject(404, "No data found")

  const comments = await db.query(
    `
  SELECT * FROM comments
  WHERE review_id = $1;
  `,
    [review_id]
  )

  return comments.rows
}

exports.insertReviewComment = async (review_id, body, username) => {
  if (!body || !username) return reject(400, "Missing or invalid value")

  const reviewExists = await validateId(review_id, "reviews")
  if (!reviewExists) return reject(404, "No review found")

  const comment = await db.query(
    `
  INSERT INTO comments
    (review_id, body, author)
  VALUES
    ($1, $2, (SELECT username FROM users WHERE username = $3))
  RETURNING *;`,
    [review_id, body, username]
  )

  return comment.rows[0]
}
