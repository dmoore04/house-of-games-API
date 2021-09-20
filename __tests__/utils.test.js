const { categoryData } = require("../db/data/test-data")
const { formatCategoryData } = require("../db/utils/data-manipulation")

describe("#formatCategories", () => {
  it("should return an empty array if one is passed", () => {
    expect(formatCategoryData([])).toEqual([])
  })
  it("should return a nested array of values for a category object", () => {
    expect(formatCategoryData(categoryData.slice(0, 1))).toEqual([
      ["euro game", "Abstact games that involve little luck"],
    ])
  })
  it("should handle arbitrary numbers of categories", () => {
    expect(formatCategoryData(categoryData).length).toBe(4)
  })
})
