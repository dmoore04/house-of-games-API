exports.handlePSQL = (err, req, res, next) => {
  const codeMap = {
    42703: "Invalid query value",
    "22P02": "Bad request",
  }

  const msg = codeMap[err.code]
  msg ? res.status(400).send({ msg }) : next(err)
}

exports.handleCustom = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
}

exports.handle500 = (err, req, res, next) => {
  console.log(err)
  res.status(500).send(err.msg)
}
