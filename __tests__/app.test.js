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
      const endpoints = [
        "GET /api/categories",
        "GET /api",
        "GET /api/reviews",
        "GET /api/reviews/:review_id",
        "PATCH /api/reviews/:review_id",
        "GET /api/reviews/:review_id/comments",
        "POST /api/reviews/:review_id/comments",
        "DELETE /api/comments/:comment_id",
        "GET /api/users",
        "DELETE /api/comments/:comment_id",
        "PATCH /api/comments/:comment_id",
      ]

      const res = await request(app).get("/api").expect(200)
      const resKeys = Object.keys(res.body.endpoints)

      expect(resKeys.length).toBe(endpoints.length)

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
          expect(review).not.toHaveProperty("review_body")
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
          expect(response.body.reviews.length).toBe(13)
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

        const lengths = [1, 11, 1, 0]

        const requests = categories.map((category) =>
          request(app).get(`/api/reviews?category=${category}`).expect(200)
        )

        const responses = await Promise.all(requests)

        responses.forEach((response, index) => {
          expect(response.body.reviews.length).toBe(lengths[index])
          response.body.reviews.forEach((review) => {
            expect(review).toHaveProperty("category", categories[index])
          })
        })
      })

      it("400: responds with an error message when an invalid query value is provided ", async () => {
        const badQueries = [
          "sort_by=bananas",
          "sort_by=review_id; DROP TABLE IF EXISTS reviews;",
          "sort_by=1",
          "category=1",
          "order=not_an_order",
          "order=1",
        ]

        const requests = badQueries.map((query) => {
          return request(app).get(`/api/reviews?${query}`).expect(400)
        })

        const responses = await Promise.all(requests)

        expect(responses.length).toBe(badQueries.length)

        responses.forEach((response) => {
          expect(response.body.msg).toBe("Invalid query value")
        })
      })

      it("404: responds with an error message when category value could not be found", async () => {
        const res = await request(app)
          .get("/api/reviews?category=bananas")
          .expect(404)

        expect(res.body.msg).toBe("non-existent category")
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

        it("400: responds with an error message when id parameter is not a number", async () => {
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

      describe("PATCH", () => {
        it("200: updates the review and responds with its updated state", async () => {
          const res = await request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 3 })
            .expect(200)

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

        it("400: responds with an error message when body is malformed", async () => {
          const res = await request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: "bad value" })
            .expect(400)
          expect(res.body.msg).toBe("Bad request")
        })

        it("400: responds with an error message when review_id is not a number", async () => {
          const res = await request(app)
            .patch("/api/reviews/not_a_number")
            .send({ inc_votes: 1 })
            .expect(400)
          expect(res.body.msg).toBe("Bad request")
        })

        it("404: responds with an error message when no review with specified id exists", async () => {
          const res = await request(app)
            .patch("/api/reviews/999999")
            .expect(404)
          expect(res.body.msg).toBe("No data found")
        })
      })

      describe("/comments", () => {
        describe("GET", () => {
          it("200: responds with an array of comments for the given review_id", async () => {
            const res = await request(app)
              .get("/api/reviews/2/comments")
              .expect(200)

            const expected = {
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.stringMatching(/^\d{4}.+\w$/),
              author: expect.any(String),
              body: expect.any(String),
            }

            expect(res.body.comments.length).toBe(3)

            res.body.comments.forEach((comment) => {
              expect(comment).toMatchObject(expected)
            })
          })

          it("200: responds with an array of comments for the given review_id (no comments)", async () => {
            const res = await request(app)
              .get("/api/reviews/1/comments")
              .expect(200)

            expect(res.body.comments).toEqual([])
          })

          it("400: responds with an error message when review_id is not a number", async () => {
            const res = await request(app)
              .get("/api/reviews/not_a_number/comments")
              .expect(400)

            expect(res.body.msg).toBe("Bad request")
          })

          it("404: responds with an error message when given review doesnt exist", async () => {
            const res = await request(app)
              .get("/api/reviews/999999/comments")
              .expect(404)

            expect(res.body.msg).toBe("No data found")
          })
        })
        describe("POST", () => {
          it("201: creates a new comment object tied to the given review, responds with the posted comment", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                username: "mallionaire",
                body: "es muy grande mucho",
              })
              .expect(201)

            const expected = {
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.stringMatching(/^\d{4}.+\w$/),
              author: expect.any(String),
              body: expect.any(String),
            }

            expect(res.body.comment).toMatchObject(expected)
          })

          it("201: ignores unnecessary properties", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                username: "mallionaire",
                body: "es muy grande mucho",
                fruit: "bananas",
              })
              .expect(201)

            expect(res.body.comment).not.toHaveProperty("fruit")
          })

          it("400: responds with an error mesage if the body is malformed (missing values)", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                bad_key: "test value",
              })
              .expect(400)

            expect(res.body.msg).toBe("Missing or invalid value")
          })

          it("400: responds with an error message when review_id is not a number ", async () => {
            const res = await request(app)
              .post("/api/reviews/not_a_number/comments")
              .send({ username: "philippaclaire9", body: "test body" })
              .expect(400)
            expect(res.body.msg).toBe("Bad request")
          })

          it("404: responds with an error message when given review does not exist", async () => {
            const res = await request(app)
              .post("/api/reviews/99999/comments")
              .send({ username: "philippaclaire9", body: "test body" })
              .expect(404)

            expect(res.body.msg).toBe("No review found")
          })

          it("422: responds with an error message when the user given does not exist", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({ username: "idontexist", body: "test body" })
              .expect(422)

            expect(res.body.msg).toBe("Bad value in body")
          })
        })
      })
    })
  })
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("DELETE", () => {
        it("204: deletes comment from the database, responds with no content", async () => {
          const res = await request(app).delete("/api/comments/1").expect(204)
          expect(res.body).toEqual({})
          const res2 = await request(app).delete("/api/comments/1").expect(404)
          expect(res2.body.msg).toBe("No data found")
        })

        it("404: responds with an error message if the comment was not in the db", async () => {
          const res = await request(app).delete("/api/comments/0").expect(404)
          expect(res.body.msg).toBe("No data found")
        })

        it("400: responds with an error message if comment_id is not a number", async () => {
          const res = await request(app)
            .delete("/api/comments/bananas")
            .expect(400)

          expect(res.body.msg).toBe("comment_id should be a number")
        })
      })

      describe("PATCH", () => {
        it("200: updates a single comment object, responds with the updated comment", async () => {
          const res = await request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)

          const expected = {
            comment_id: 1,
            votes: 17,
            created_at: expect.stringMatching(/^\d{4}.+\w$/),
            author: "bainesface",
            body: "I loved this game too!",
          }

          expect(res.body.comment).toMatchObject(expected)
        })

        it("400: responds with an error message when comment_id is not a number", async () => {
          const res = await request(app)
            .patch("/api/comments/not_an_id")
            .send({ inc_votes: 1 })
            .expect(400)

          expect(res.body.msg).toBe("comment_id should be a number")
        })

        it("404: responds with an error message when id is valid but no comments found", async () => {
          const res = await request(app)
            .patch("/api/comments/0")
            .send({ inc_votes: 1 })
            .expect(404)

          expect(res.body.msg).toBe("No data found")
        })

        it("400: responds with an error message if req body is malformed", async () => {
          const res = await request(app)
            .patch("/api/comments/1")
            .send({ bad_key: 100 })
            .expect(400)

          expect(res.body.msg).toBe("Missing or invalid value")

          const res2 = await request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "notanum" })
            .expect(400)

          expect(res2.body.msg).toBe("inc_votes should be a number")
        })
      })
    })
  })
  describe("/users", () => {
    describe("GET", () => {
      it("200: responds  with an array of user objects", async () => {
        const res = await request(app).get("/api/users").expect(200)

        expect(res.body.users.length).toBe(4)

        const expected = {
          username: expect.any(String),
          avatar_url: expect.stringContaining("https://"),
          name: expect.any(String),
        }

        res.body.users.forEach((user) => {
          expect(user).toMatchObject(expected)
        })
      })
    })
    describe("/:username", () => {
      describe("GET", () => {
        it("200: responds with the given users object", async () => {
          const res = await request(app).get("/api/users/dav3rid").expect(200)

          const expected = {
            username: "dav3rid",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            name: "dave",
          }

          expect(res.body.user).toMatchObject(expected)
        })

        it("404: responds with an error message when no user is found", async () => {
          const res = await request(app)
            .get("/api/users/theinvisiblem4n")
            .expect(404)

          expect(res.body.msg).toBe("No data found")
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
        "/api/reviews/1/comets",
      ]
      const requests = badRoutes.map((route) =>
        request(app).get(route).expect(404)
      )
      const responses = await Promise.all(requests)

      expect(responses.length).toBe(badRoutes.length)

      const bodies = responses.map((response) => response.body)
      bodies.forEach((body) => {
        expect(body.msg).toBe("Route not found")
      })
    })
  })
})
