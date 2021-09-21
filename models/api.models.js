const { readFile } = require("fs/promises")

exports.fetchEndpoints = async () => {
  const data = await readFile(`${__dirname}/../endpoints.json`, "utf8")
  return JSON.parse(data)
}
