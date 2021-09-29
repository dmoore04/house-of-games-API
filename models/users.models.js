const db = require("../db/connection")
const { reject } = require("../errors/utils")

exports.selectUsers = async () => {
  const queryStr = `SELECT * from users;`

  const results = await db.query(queryStr)

  return results.rows
}

exports.selectUser = async (username) => {
  const queryStr = `
  SELECT * from users
  WHERE username = $1;
  `
  const results = await db.query(queryStr, [username])

  if (results.rows.length === 0) return reject(404, "No data found")

  return results.rows[0]
}
