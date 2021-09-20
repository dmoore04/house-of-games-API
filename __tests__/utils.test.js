const { categoryData, userData, reviewData } = require("../db/data/test-data")
const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
} = require("../db/utils/data-manipulation")

describe("#formatCategoryData", () => {
  it("should return an empty array if one is passed", () => {
    expect(formatCategoryData([])).toEqual([])
  })
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
  it("should return an empty array if passed one", () => {
    expect(formatUserData([])).toEqual([])
  })

  it("should return a nested array of values for a nested person object", () => {
    expect(formatUserData(userData.slice(0, 1))).toEqual([
      [
        "mallionaire",
        "haz",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
    ])
  })

  it("should handle an arbitrary number of person objects", () => {
    expect(formatUserData(userData).length).toBe(4)
  })
})

describe.only("#formatReviewData", () => {
  it("should return an empty array if passed one", () => {
    expect(formatReviewData([])).toEqual([])
  })

  it("should return a nested array of values for a nested person object", () => {
    expect(formatReviewData(reviewData.slice(0, 1))).toEqual([
      [
        "Agricola",
        "Uwe Rosenberg",
        "mallionaire",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        "Farmyard fun!",
        "euro game",
        new Date(1610964020514),
        1,
      ],
    ])
  })

  it("should handle an arbitrary number of person objects", () => {
    expect(formatReviewData(reviewData).length).toBe(13)
  })
})
