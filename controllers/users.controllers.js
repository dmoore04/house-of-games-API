const { selectUsers, selectUser } = require("../models/users.models")

exports.sendUsers = async (req, res, next) => {
  try {
    const users = await selectUsers()
    res.status(200).send({ users })
  } catch (err) {
    next(err)
  }
}

exports.sendUser = async (req, res, next) => {
  try {
    const { username } = req.params
    const user = await selectUser(username)
    res.status(200).send({ user })
  } catch (err) {
    next(err)
  }
}
