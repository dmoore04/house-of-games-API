const express = require("express")
const apiRouter = require("./routes/api.router")
const errors = require("./errors")

const app = express()

app.use(express.json())

app.use("/api", apiRouter)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" })
})

app.use(errors.handleCustom)
app.use(errors.handlePSQL)
app.use(errors.handle500)

module.exports = app
