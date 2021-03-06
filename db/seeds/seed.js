const db = require("../connection")
const format = require("pg-format")
const { formatData } = require("../utils/data-manipulation")

exports.seed = async (data) => {
  try {
    await createTables()
    await insertData(data)
  } catch (err) {
    console.log(err)
  }
}

/* Helper Functions */

const createTables = async () => {
  await dropTables()
  /* Query Strings */
  const createCategories = `
    CREATE TABLE categories (
      slug VARCHAR(40) PRIMARY KEY,
      description TEXT NOT NULL
    );`
  const createUsers = `
    CREATE TABLE users (
      username VARCHAR(40) PRIMARY KEY,
      avatar_url TEXT NOT NULL,
      name VARCHAR(40) NOT NULL
    );`
  const reviewImgDefaultURL =
    "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg"
  const createReviews = `
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR(40),
      review_img_url TEXT DEFAULT '${reviewImgDefaultURL}',
      votes INT DEFAULT 0,
      category VARCHAR(40) REFERENCES categories(slug) NOT NULL,
      owner VARCHAR(40) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  const createComments = `
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(40) REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );`

  await Promise.all([db.query(createCategories), db.query(createUsers)])

  await db.query(createReviews)
  await db.query(createComments)
}

const dropTables = async () => {
  await db.query(`DROP TABLE IF EXISTS comments;`)
  await db.query(`DROP TABLE IF EXISTS reviews;`)

  await Promise.all([
    db.query(`DROP TABLE IF EXISTS users;`),
    db.query(`DROP TABLE IF EXISTS categories;`),
  ])
}

const insertData = async (data) => {
  const { categoryValues, userValues, reviewValues, commentValues } =
    formatData(data)

  const insertUsersQuery = format(
    `
  INSERT INTO users
    (username, avatar_url, name)
  VALUES
    %L
  RETURNING *;
  `,
    userValues
  )

  const insertCategoriesQuery = format(
    `
  INSERT INTO categories
    (slug, description)
  VALUES
    %L
  RETURNING *;
  `,
    categoryValues
  )

  await Promise.all([
    db.query(insertUsersQuery),
    db.query(insertCategoriesQuery),
  ])

  const insertReviewsQuery = format(
    `
  INSERT INTO reviews
    (title, review_body, designer, review_img_url, votes, category, owner, created_at)
  VALUES
    %L
  RETURNING *;
  `,
    reviewValues
  )
  await db.query(insertReviewsQuery)

  const insertCommentsQuery = format(
    `
  INSERT INTO comments
    (author, review_id, votes, created_at, body)
  VALUES
    %L
  RETURNING *;
  `,
    commentValues
  )
  await db.query(insertCommentsQuery)
}
