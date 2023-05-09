const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err, "errorrrr");
  res.status(500).send("Something went wrong!");
});

module.exports = app;

// Responds with:

// an array of topic objects, each of which should have the following properties:
// slug
// description
// As this is the first endpoint you will need to set up your testing suite.

// Errors handled.

// Errors to Consider - add errors to handle as items to the checklist
