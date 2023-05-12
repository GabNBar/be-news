const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticles,
  getCommentsByArticle,
} = require("./controllers/articles.controller");

app.get("/api/topics", getTopics);

//3.5
app.get("/api", getEndpoints);
//4
app.get("/api/articles/:article_id", getArticleById);
//5
app.get("/api/articles", getArticles);
//6
app.get("/api/:article_id/comments", getCommentsByArticle);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Bad request, no ID provided for the article." });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Article not found!" });
  } else next;
});

app.use((err, req, res, next) => {
  console.log(err, "last error handling-middleware!");
  res.status(500).send("Something went wrong!");
});

module.exports = app;
