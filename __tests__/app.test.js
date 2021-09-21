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
          review_img_url: expect.stringContaining("https://"),
          category: expect.any(String),
          created_at: expect.stringMatching(/^\d{4}.+\w$/),
          votes: expect.any(Number),
          review_id: expect.any(Number),
          comment_count: expect.any(Number),
        }
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject(expected)
        })
      })

      it("200: sorts results by the value of the sort_by query if one is provided", async () => {
        const validQueries = [
          "review_id",
          "created_at",
          "category",
          "title",
          "owner",
          "votes",
          "designer",
        ]

        const requests = validQueries.map((query) =>
          request(app).get(`/api/reviews?sort_by=${query}`).expect(200)
        )

        const responses = await Promise.all(requests)
        const bodies = responses.map((response) => response.body)

        bodies.forEach((body, index) => {
          expect(body.reviews).toBeSortedBy(validQueries[index])
        })
      })
    })
  })
})

describe.only("/a_bad_route", () => {
  describe("GET", () => {
    it("404: reponds with a not found error message", async () => {
      const badRoutes = ["/apy", "/api/cattygories", "/api/reeeviewz"]
      const requests = badRoutes.map((route) =>
        request(app).get(route).expect(404)
      )
      const responses = await Promise.all(requests)
      const bodies = responses.map((response) => response.body)
      bodies.forEach((body) => {
        expect(body.msg).toBe("Route not found")
      })
    })
  })
})
