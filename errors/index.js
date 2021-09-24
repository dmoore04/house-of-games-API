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
    23503: {
      status: 404,
      msg: "Invalid review_id",
    },
  }
  if (codeMap[err.code]) {
    const { status, msg } = codeMap[err.code]
    res.status(status).send({ msg })
  } else {
    next(err)
  }
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
