const db = require("../db/connection")

exports.selectCategories = async () => {
  const results = await db.query(`SELECT * FROM categories;`)
  return results.rows
}
