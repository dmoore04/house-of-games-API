const usersRouter = require("express").Router()
const { sendUsers, sendUser } = require("../controllers/users.controllers")

usersRouter.get("/", sendUsers)
usersRouter.get("/:username", sendUser)

module.exports = usersRouter
