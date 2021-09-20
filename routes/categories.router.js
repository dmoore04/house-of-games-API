const categoriesRouter = require("express").Router()
const { sendCategories } = require("../controllers/categories.controllers")

categoriesRouter.get("/", sendCategories)

module.exports = categoriesRouter
