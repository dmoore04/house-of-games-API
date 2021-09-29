const { selectUsers } = require("../models/users.models")

exports.sendUsers = async (req, res, next) => {
  try {
    const users = await selectUsers()
    res.status(200).send({ users })
  } catch (err) {
    next(err)
  }
}
