const apiRouter = require("express").Router()
const categoriesRouter = require("./categories.router")
const reviewsRouter = require("./reviews.router")
const { sendEndpoints } = require("../controllers/api.controllers")

apiRouter.use("/categories", categoriesRouter)
apiRouter.use("/reviews", reviewsRouter)

apiRouter.get("/", sendEndpoints)

module.exports = apiRouter
