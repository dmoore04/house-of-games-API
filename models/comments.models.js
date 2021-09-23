const db = require("../db/connection")

exports.selectReviewComments = async (review_id) => {
  const comments = await db.query(
    `
  SELECT * FROM comments
  WHERE review_id = $1;
  `,
    [review_id]
  )

  return comments.rows
}
