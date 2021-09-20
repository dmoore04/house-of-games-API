exports.formatCategoryData = (categories) => {
  if (!categories.length) return []
  return categories.map((category) => [category.slug, category.description])
}
