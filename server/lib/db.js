const low = require('lowdb')
const uuid = require('node-uuid')

const db = low()
db.defaults({ questions: [] })
  .value()

function getQuestions () {
  return db
    .get('questions')
    .value()
}

function insertQuestion (question) {
  db.get('questions').push(question).value()
  return question
}

function createQuestion (options) {
  const {
    id = uuid.v4(),
    question = null,
    createdAt = new Date(),
    answer = null,
    readAt = null,
    syncAt = null,
    user = null,
    channel = null
  } = options

  return {
    id,
    question,
    createdAt,
    answer,
    readAt,
    syncAt,
    user,
    channel
  }
}

module.exports = {
  db,
  getQuestions,
  insertQuestion,
  createQuestion
}
