const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

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
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
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
});
