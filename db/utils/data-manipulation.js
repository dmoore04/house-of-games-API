exports.formatCategoryData = (categories) => {
  return categories.map((category) => [category.slug, category.description])
}

exports.formatUserData = (users) => {
  return users.map((user) => [user.username, user.avatar_url, user.name])
}

exports.formatReviewData = (reviews) => {
  return reviews.map((review) => [
    review.title,
    review.review_body,
    review.designer,
    review.review_img_url,
    review.votes,
    review.category,
    review.owner,
    review.created_at,
  ])
}

exports.formatCommentData = (comments) => {
  return comments.map((comment) => [
    comment.author,
    comment.review_id,
    comment.votes,
    comment.created_at,
    comment.body,
  ])
}
