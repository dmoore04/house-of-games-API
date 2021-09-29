const db = require("../db/connection")

exports.selectCategories = async () => {
  const results = await db.query(`SELECT * FROM categories;`)
  return results.rows
}

exports.validateCategory = async (category) => {
  const results = await db.query(
    `SELECT * FROM categories
  WHERE slug = $1`,
    [category]
  )

  return Boolean(results.rows.length)
}
