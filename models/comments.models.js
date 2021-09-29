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

exports.removeComment = async (comment_id) => {
  if (Number.isNaN(parseInt(comment_id)))
    return reject(400, "comment_id should be a number")

  const queryStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `

  const results = await db.query(queryStr, [comment_id])

  if (results.rows.length === 0) return reject(404, "No data found")

  return {}
}

exports.updateComment = async (comment_id, inc_votes = 0) => {
  if (Number.isNaN(parseInt(comment_id)))
    return reject(400, "comment_id should be a number")

  const queryStr = `
  UPDATE comments
  set votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;
  `

  const results = await db.query(queryStr, [inc_votes, comment_id])

  return results.rows[0]
}
