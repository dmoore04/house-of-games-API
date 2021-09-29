const db = require("../db/connection")

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

  return results.rows[0]
}
