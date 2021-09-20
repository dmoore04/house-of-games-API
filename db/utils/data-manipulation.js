exports.formatCategoryData = (categories) => {
  if (!categories.length) return []
  return categories.map((category) => [category.slug, category.description])
}

exports.formatUserData = (users) => {
  if (!users.length) return []
  return users.map((user) => [user.username, user.name, user.avatar_url])
}
