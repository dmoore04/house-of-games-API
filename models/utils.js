const db = require("../db/connection")
const format = require("pg-format")

exports.validateId = async (id, table) => {
  const queryStr = format(`SELECT * FROM %I WHERE review_id = $1`, [table])
  const result = await db.query(queryStr, [id])
  return Boolean(result.rows.length)
}
