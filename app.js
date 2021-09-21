const express = require("express")
const apiRouter = require("./routes/api.router")

const app = express()

app.use(express.json())

app.use("/api", apiRouter)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send(err.msg)
})

module.exports = app
