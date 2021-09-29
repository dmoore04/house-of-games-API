const { removeComment, updateComment } = require("../models/comments.models")

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params
    const deleted = await removeComment(comment_id)
    res.status(204).send(deleted)
  } catch (err) {
    next(err)
  }
}

exports.patchComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    if (!inc_votes) {
      res.status(400).send({ msg: "Missing or invalid value" })
    } else {
      const comment = await updateComment(comment_id, inc_votes)
      res.status(200).send({ comment })
    }
  } catch (err) {
    next(err)
  }
}
