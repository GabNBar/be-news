const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET - 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics.length > 0).toBe(true);
        res.body.topics.forEach((topic) => {
          expect(topic.hasOwnProperty("slug")).toBe(true);
          expect(typeof topic.slug).toBe("string");
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

//3.5
describe("/api", () => {
  test("GET - 200: responds with a JSON object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const endpoints = res.body;
        expect(endpoints.hasOwnProperty("GET /api")).toBe(true);
        expect(endpoints.hasOwnProperty("GET /api/topics")).toBe(true);
        expect(endpoints.hasOwnProperty("GET /api/articles")).toBe(true);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with status 200 and the requested article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("responds with status 404 for non-existent article ID", () => {
    return request(app)
      .get("/api/articles/5000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found!");
      });
  });

  test("responds with status 400 for bad request article ID", () => {
    return request(app)
      .get("/api/articles/gabe")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Bad request, no ID provided for the article."
        );
      });
  });
});

//5
describe("/api/articles", () => {
  test("GET - status 200 - responds list of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length === 12).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");

          expect(typeof article.body).toBe("undefined");
        });
      });
  });
  test("GET - status 200 - responds list of articles sorted date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        articles.forEach(() => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
});
//6
describe("GET /api/:article_id/articles", () => {
  test("responds with status 200 and all requested comments for a given article", () => {
    return request(app)
      .get("/api/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        //Assert that comments are coming in.
        expect(comments.length > 0).toBe(true);

        //Assert that we get the amount of comments we are expecting.
        expect(comments.length === 11).toBe(true);

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });

  test("GET - status 200 - responds list of articles sorted date descending", () => {
    return request(app)
      .get("/api/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;

        comments.forEach(() => {
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });

  test("responds with status 404 for no comments at given article", () => {
    return request(app)
      .get("/api/555/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No comments here.🙀");
      });
  });
});

// 7
describe.skip("POST 201: responds with inserted comment", () => {
  test("that a valid format is inserted into the database and the created comment is returned", () => {
    const articleId = 1;
    const newComment = {
      username: "butter_bridge",
      body: "this is a test comment.",
    };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty("comment");
        const returnedComment = response.body.comment;
        expect(returnedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: newComment.body,
            article_id: articleId,
            author: newComment.username,
            votes: 0,
            created_at: expect.stringMatching(
              /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
            ),
          })
        );
      });
  });
});

describe.skip("Post /api/articles/:article_id/comments", () => {
  test("Status 201 - responds with the newly added comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Just another random comment.",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 3,
          author: "butter_bridge",
          body: "Just another random comment.",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("Status 201 - addition of extra properties in post body are ignored ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Just another random comment.",
      extra: "This property will be ignored",
      anotherExtra: "This property will also be ignored",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 3,
          author: "butter_bridge",
          body: "Just another random comment.",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("Status 400 - missing properties from post body ", () => {
    const newComment = {
      username: "butter_bridge",
      body: null,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid post body");
      });
  });
  test("Status 400 - properties in incorrect format ", () => {
    const newComment = {
      username: "butter_bridge",
      bodys: 19998,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid post body");
      });
  });
  test("Status 400 - invalid article ID ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Just another random comment.",
    };
    return request(app)
      .post("/api/articles/25Nonsense/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Bad request, no ID provided for the article.")
      );
  });
  test("status 404 - valid but non-existent username ", () => {
    const newComment = {
      username: "cool_dev",
      body: "Just another random comment.",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
  test("Status 404 - valid but non-existent article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Just another random comment.",
    };
    return request(app)
      .post("/api/articles/99911/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
});

// 8

describe.skip("PATCH /api/comments/:comment_id", () => {
  const newVote = { inc_votes: 20 };
  test("Status 200 - updates the given articles' votes and returns it", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 120,
          topic: "mitch",
          author: "butter_bridge",
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Status 400 - incomplete request body ", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid post body");
      });
  });
  test("Status 400 - invalid votes format ", () => {
    const newVote = { inc_votes: "twenty" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - Invalid input data type");
      });
  });
  test("Status 400 - invalid article ID", () => {
    const newVote = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/25Nonsense")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - Invalid input data type");
      });
  });
  test("Status 404 - valid but non-existent article ID", () => {
    const newVote = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/99999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
