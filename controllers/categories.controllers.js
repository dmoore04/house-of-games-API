const { selectCategories } = require("../models/categories.models")

exports.sendCategories = async (req, res, next) => {
  try {
    const categories = await selectCategories()
    res.status(200).send({ categories })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
