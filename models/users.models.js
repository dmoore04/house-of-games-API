const db = require("../db/connection")

exports.selectUsers = async () => {
  const queryStr = `SELECT * from users;`

  const results = await db.query(queryStr)

  return results.rows
}
