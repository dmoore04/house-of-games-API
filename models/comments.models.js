const db = require("../db/connection")
const { reject404 } = require("../errors/utils")

exports.selectReviewComments = async (review_id) => {
  const comments = await db.query(
    `
  SELECT * FROM comments
  WHERE review_id = $1;
  `,
    [review_id]
  )

  if (comments.rows.length === 0) return reject404()

  return comments.rows
}

exports.insertReviewComment = async (review_id, body, username) => {
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
