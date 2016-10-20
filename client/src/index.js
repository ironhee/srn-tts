import 'whatwg-fetch'
import ReactDOM from 'react-dom'
import React from 'react'
import { Router, IndexRoute, Route, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import App from './components/App'
import IndexPage from './components/IndexPage'
import ChannelPage from './components/ChannelPage'
import createStore from './redux/createStore'

const store = createStore(hashHistory)

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={IndexPage} />
        <Route path='/c/:channel' component={ChannelPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
