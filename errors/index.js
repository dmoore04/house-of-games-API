exports.handlePSQL = (err, req, res, next) => {
  const codeMap = {
    42703: {
      status: 400,
      msg: "Invalid query value",
    },
    23502: {
      status: 422,
      msg: "Bad value in body",
    },
    "22P02": {
      status: 400,
      msg: "Bad request",
    },
  }

  const { status, msg } = codeMap[err.code]
  msg ? res.status(status).send({ msg }) : next(err)
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
