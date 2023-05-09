const db = require("../db/connection");

exports.fetchTopics = () => {
  console.log("in the model");
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
