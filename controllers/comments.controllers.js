const { removeComment } = require("../models/comments.models")

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params
    const deleted = await removeComment(comment_id)
    res.status(204).send(deleted)
  } catch (err) {
    next(err)
  }
}
