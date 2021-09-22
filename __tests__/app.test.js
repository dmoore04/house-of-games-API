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

        responses.forEach((response, index) => {
          expect(response.body.reviews).toBeSortedBy(validQueries[index], {
            descending: true,
          })
        })
      })

      it("200: orders results according to the value of the order query", async () => {
        const res = await request(app).get("/api/reviews?order=asc").expect(200)

        const reviews = res.body.reviews
        expect(reviews).toBeSortedBy("created_at", { descending: false })
      })

      it("200: filters results according to the category query value", async () => {
        const categories = [
          "euro game",
          "social deduction",
          "dexterity",
          "children's games",
        ]

        const requests = categories.map((category) =>
          request(app).get(`/api/reviews?category=${category}`).expect(200)
        )

        const responses = await Promise.all(requests)
        responses.forEach((response, index) => {
          response.body.reviews.forEach((review) => {
            expect(review).toHaveProperty("category", categories[index])
          })
        })
      })

      it("400: responds with an error message when a bad query value is provided ", async () => {
        const badQueries = [
          "sort_by=not_a_column",
          "sort_by=review_id; DROP TABLE IF EXISTS reviews;",
          "sort_by=1",
          "category=not_a_category",
          "category=1",
          "order=not_an_order",
          "order=1",
        ]

        const requests = badQueries.map((query) =>
          request(app).get(`/api/reviews?${badQueries}`).expect(400)
        )

        const responses = await Promise.all(requests)
        responses.forEach((response) => {
          expect(response.body.msg).toBe("Invalid query value")
        })
      })
    })
    describe("/:review_id", () => {
      describe("GET", () => {
        it("200: responds with a review object corresponsing to the passed id", async () => {
          const res = await request(app).get("/api/reviews/1").expect(200)
          const expected = {
            title: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.stringContaining("https://"),
            category: expect.any(String),
            created_at: expect.stringMatching(/^\d{4}.+\w$/),
            votes: expect.any(Number),
            review_id: 1,
            comment_count: expect.any(Number),
          }
          expect(res.body.review).toMatchObject(expected)
        })

        it("400: responds with an error message when an invalid parameter is provided", async () => {
          const res = await request(app)
            .get("/api/reviews/not_a_number")
            .expect(400)
          expect(res.body.msg).toBe("Bad request")
        })

        it("404: responds with an error message when the request is well formed but no data was found", async () => {
          const res = await request(app).get("/api/reviews/999999").expect(404)
          expect(res.body.msg).toBe("No data found")
        })
      })

      describe.only("PATCH", () => {
        it("201: updates the review and responds with its updated state", async () => {
          const res = await request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 3 })
            .expect(201)

          const expected = {
            title: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.stringContaining("https://"),
            category: expect.any(String),
            created_at: expect.stringMatching(/^\d{4}.+\w$/),
            votes: 4,
            review_id: 1,
          }

          expect(res.body.review).toMatchObject(expected)
        })
      })
    })
  })
})

describe("/a_bad_route", () => {
  describe("GET", () => {
    it("404: reponds with a not found error message", async () => {
      const badRoutes = [
        "/apy",
        "/api/cattygories",
        "/api/reeeviewz?sort_by=review_id",
      ]
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
