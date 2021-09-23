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
