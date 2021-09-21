const reviewsRouter = require("express").Router()
const { sendReviews } = require("../controllers/reviews.controllers")

reviewsRouter.get("/", sendReviews)
module.exports = reviewsRouter
