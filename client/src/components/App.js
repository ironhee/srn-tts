import React, { Component } from 'react'
import { connect } from 'react-redux'
import fp from 'lodash/fp'
import io from 'socket.io-client'
import { questionCreated } from '../redux/modules/questions'
import './App.css'

class App extends Component {

  constructor (props) {
    super(props)
    this.socket = io()
    this.onQuestionCreated = this.onQuestionCreated.bind(this)
  }

  componentDidMount () {
    this.socket.on('question:created', this.onQuestionCreated)
  }

  componentDidUpdate (prevProps) {
    const { questions } = this.props
    const newQuestionIds = fp.difference(fp.keys(questions))(fp.keys(prevProps.questions))
    const newQuestions = fp.map(questionId => questions[questionId])(newQuestionIds)
    const unsyncQuestions = fp.filter(question => !question.syncAt)(newQuestions)
    if (unsyncQuestions.length) {
      fp.each(question => this.socket.emit('question:create', question))(unsyncQuestions)
    }
  }

  onQuestionCreated (question) {
    this.props.questionCreated(question)
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       socket: this.socket
     })
    )

    const style = {
      width: window ? window.innerWidth : 0,
      height: window ? window.innerHeight : 0
    }

    return (
      <div
        className='App'
        ref={(c) => { this.$app = c }}
        style={style}
      >
        { childrenWithProps }
      </div>
    )
  }

}

App.propTypes = {
  children: React.PropTypes.object
}

export default connect(
  (state) => ({
    questions: state.questions.questions
  }), {
    questionCreated
  })(App)
