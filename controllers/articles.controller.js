const { fetchArticleById } = require("../models/fetchArticleById.model.js");
const { fetchArticles } = require("../models/fetchArticles.model.js");
const {
  fetchCommentsByArticles,
} = require("../models/fetchCommentsByArticles.js");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchCommentsByArticles(articleId)
    .then((allComments) => {
      res.status(200).send({ allComments });
    })
    .catch((err) => {
      next(err);
    });
};
