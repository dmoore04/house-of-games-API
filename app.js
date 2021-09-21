const express = require("express")
const apiRouter = require("./routes/api.router")
const { handlePSQL400Errors } = require("./errors")

const app = express()

app.use(express.json())

app.use("/api", apiRouter)

app.use(handlePSQL400Errors)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" })
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send(err.msg)
})

module.exports = app
