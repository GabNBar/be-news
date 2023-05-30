const db = require("../db/connection");

exports.fetchCommentsByArticles = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        // console.log("in reject", result.rows);
        return Promise.reject({ status: 404, msg: "No comments here.🙀" });
      } else {
        // console.log("in fulfill", result.rows);
        return result.rows;
      }
    });
};
