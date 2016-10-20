// Actions
const CREATED = 'srn-tts/questions/CREATED'
const READ = 'srn-tts/questions/READ'

// Reducer
const initialState = {
  questions: {}
}
export default function reducer (state = initialState, action = {}) {
  const { questions } = state
  let question

  switch (action.type) {
    // do reducer stuff
    case CREATED:
      question = {
        ...action.question,
        syncAt: new Date()
      }
      return {
        ...state,
        questions: {
          ...questions,
          [question.id]: question
        }
      }
    case READ:
      question = {
        ...questions[action.questionId],
        readAt: new Date()
      }
      return {
        ...state,
        questions: {
          ...questions,
          [question.id]: question
        }
      }
    default:
      return state
  }
}

// Action Creators
export function questionCreated (question) {
  return { type: CREATED, question }
}

export function readQuestion (questionId) {
  return { type: READ, questionId }
}
