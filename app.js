const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");

app.get("/api/topics", getTopics);

//3.5
app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  console.log(err, "errorrrr");
  res.status(500).send("Something went wrong!");
});

module.exports = app;
