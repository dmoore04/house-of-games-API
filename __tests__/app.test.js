const db = require("../db/connection.js")
const testData = require("../db/data/test-data/index.js")
const { seed } = require("../db/seeds/seed.js")
const app = require("../app")
const request = require("supertest")

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("/api", () => {
  describe("GET", () => {
    it("200: responds with a json representation of all available endpoints", async () => {
      const endpoints = ["GET /api/categories", "GET /api", "GET /api/reviews"]
      const res = await request(app).get("/api").expect(200)
      endpoints.forEach((endpoint) => {
        expect(res.body.endpoints).toHaveProperty(endpoint)
        expect(res.body.endpoints[endpoint]).toHaveProperty("description")
      })
    })
  })
  describe("/categories", () => {
    describe("GET", () => {
      it("200: responds with an array of appropriate category objects", async () => {
        const { body } = await request(app).get("/api/categories").expect(200)

        expect(body.categories.length).toBe(4)

        expect(body.categories[0]).toMatchObject({
          slug: "euro game",
          description: "Abstact games that involve little luck",
        })

        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        })
      })
    })
  })
  describe("/reviews", () => {
    describe("GET", () => {
      it("200: responds with an array of all reviews", async () => {
        const res = await request(app).get("/api/reviews").expect(200)
        expect(res.body.reviews.length).toBe(13)
        const expected = {
          title: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          review_id: expect.any(Number),
          comment_count: expect.any(Number),
        }
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject(expected)
        })
      })
    })
  })
})
