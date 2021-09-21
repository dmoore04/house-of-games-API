exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Invalid query value" })
  } else {
    next(err)
  }
}
