import { createStore as _createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import reducer from './modules/reducer'

function createStore (history, state = {}) {
  const reduxRouterMiddleware = routerMiddleware(history)
  const middlewares = [reduxRouterMiddleware, thunk]
  const store = applyMiddleware(...middlewares)(_createStore)(reducer, state)
  return store
}

export default createStore
