const formatCategoryData = (categories) => {
  return categories.map((category) => [category.slug, category.description])
}

const formatUserData = (users) => {
  return users.map((user) => [user.username, user.avatar_url, user.name])
}

const formatReviewData = (reviews) => {
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

const formatCommentData = (comments) => {
  return comments.map((comment) => [
    comment.author,
    comment.review_id,
    comment.votes,
    comment.created_at,
    comment.body,
  ])
}

const formatData = (data) => {
  const { categoryData, commentData, reviewData, userData } = data
  return {
    categoryValues: formatCategoryData(categoryData),
    commentValues: formatCommentData(commentData),
    reviewValues: formatReviewData(reviewData),
    userValues: formatUserData(userData),
  }
}

module.exports = {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatReviewData,
  formatData,
}
