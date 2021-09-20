const db = require("../db/connection.js")
const testData = require("../db/data/test-data/index.js")
const { seed } = require("../db/seeds/seed.js")
const app = require("../app")
const request = require("supertest")

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("GET /api/categories", () => {
  it("200: responds with an array of appropriate category objects", async () => {
    const { body } = await request(app).get("/api/categories").expect(200)
    expect(body.categories[0]).toMatchObject({
      slug: "euro game",
      description: "Abstact games that involve little luck",
    })
    expect(body.categories.length).toBe(4)
  })
})
