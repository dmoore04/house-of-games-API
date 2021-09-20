const {
  categoryData,
  userData,
  reviewData,
  commentData,
} = require("../db/data/test-data")

const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatCommentData,
} = require("../db/utils/data-manipulation")

describe("Data Formatting", () => {
  test("each function returns an empty array if one is passed", () => {
    const functions = [
      formatCategoryData,
      formatCommentData,
      formatReviewData,
      formatUserData,
    ]
    functions.forEach((func) => {
      expect(func([])).toEqual([])
    })
  })

  describe("#formatCategoryData", () => {
    it("should return a nested array of values for a nested category object", () => {
      expect(formatCategoryData(categoryData.slice(0, 1))).toEqual([
        ["euro game", "Abstact games that involve little luck"],
      ])
    })
    it("should handle arbitrary numbers of categories", () => {
      expect(formatCategoryData(categoryData).length).toBe(4)
    })
  })

  describe("#formatUserData", () => {
    it("should return a nested array of values for a nested person object", () => {
      expect(formatUserData(userData.slice(0, 1))).toEqual([
        [
          "mallionaire",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          "haz",
        ],
      ])
    })

    it("should handle an arbitrary number of person objects", () => {
      expect(formatUserData(userData).length).toBe(4)
    })
  })

  describe("#formatReviewData", () => {
    it("should return a nested array of values for a nested person object", () => {
      expect(formatReviewData(reviewData.slice(0, 1))).toEqual([
        [
          "Agricola",
          "Farmyard fun!",
          "Uwe Rosenberg",
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          1,
          "euro game",
          "mallionaire",
          new Date(1610964020514),
        ],
      ])
    })

    it("should handle an arbitrary number of person objects", () => {
      expect(formatReviewData(reviewData).length).toBe(13)
    })
  })

  describe("#formatCommentData", () => {
    it("should return a nested array of values for a nested comment object", () => {
      expect(formatCommentData(commentData.slice(0, 1))).toEqual([
        [
          "bainesface",
          2,
          16,
          new Date(1511354613389),
          "I loved this game too!",
        ],
      ])
    })

    it("should handle arbitrary numbers of comments", () => {
      expect(formatCommentData(commentData).length).toBe(6)
    })
  })
})
