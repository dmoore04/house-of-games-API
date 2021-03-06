const { selectCategories } = require("../models/categories.models")

exports.sendCategories = async (req, res, next) => {
  try {
    const categories = await selectCategories()
    res.status(200).send({ categories })
  } catch (err) {
    next(err)
  }
}
