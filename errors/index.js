exports.handlePSQL400Errors = (err, req, res, next) => {
  const codeMap = {
    42703: "Invalid query value",
    "22P02": "Bad request",
  }

  const msg = codeMap[err.code]
  msg ? res.status(400).send({ msg }) : next(err)
}
