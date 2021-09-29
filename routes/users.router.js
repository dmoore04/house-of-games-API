const usersRouter = require("express").Router()
const { sendUsers } = require("../controllers/users.controllers")

usersRouter.get("/", sendUsers)

module.exports = usersRouter
