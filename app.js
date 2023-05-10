const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.get("/api/topics", getTopics);

//3.5
app.get("/api", getEndpoints);
//4
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  console.log(err, "errorrrr");
  if (err.status === 404) {
    res.status(404).send({ msg: "Article not found!" });
  } else {
    res.status(500).send("Something went wrong!");
  }
});

module.exports = app;
