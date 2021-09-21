const apiRouter = require("express").Router()
const categoriesRouter = require("./categories.router")
const { sendEndpoints } = require("../controllers/api.controllers")

apiRouter.use("/categories", categoriesRouter)

apiRouter.get("/", sendEndpoints)

module.exports = apiRouter
