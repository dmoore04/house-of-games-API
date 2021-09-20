exports.formatCategoryData = (categories) => {
  if (!categories.length) return []
  return categories.map((category) => [category.slug, category.description])
}

exports.formatUserData = (users) => {
  if (!users.length) return []
  return users.map((user) => [user.username, user.name, user.avatar_url])
}

exports.formatReviewData = (reviews) => {
  if (!reviews.length) return []
  return reviews.map((review) => [
    review.title,
    review.designer,
    review.owner,
    review.review_img_url,
    review.review_body,
    review.category,
    review.created_at,
    review.votes,
  ])
}
