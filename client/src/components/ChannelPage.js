import React, { Component } from 'react'
import fp from 'lodash/fp'
import { connect } from 'react-redux'
import Hellphago from './Hellphago'
import { readQuestion } from '../redux/modules/questions'

class IndexPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      currentQuestion: null,
      unreadCount: 0
    }
    this.onSpeechEnd = this.onSpeechEnd.bind(this)
  }

  componentDidMount () {
    this.props.socket.emit('channel:join', { channel: this.props.params.channel })
  }

  componentWillUnmount () {
    this.props.socket.emit('channel:leave', { channel: this.props.params.channel })
  }

  async componentWillReceiveProps (nextProps) {
    const { questions } = nextProps
    const unreadQuestions = fp.filter(question => !question.readAt)(questions)
    const currentQuestion = unreadQuestions.length ? unreadQuestions[0] : null
    this.setState({
      currentQuestion,
      unreadCount: unreadQuestions.length
    })
  }

  onSpeechEnd () {
    const { currentQuestion } = this.state
    const { readQuestion } = this.props
    this.setState({ currentQuestion: null })
    readQuestion(currentQuestion.id)
  }

  render () {
    const { currentQuestion } = this.state
    let text = ''
    if (currentQuestion) {
      if (currentQuestion.user) {
        text += currentQuestion.user.name + ': '
      }
      text += currentQuestion.question
    }

    return (
      <div id='IndexPage' className='page'>
        <Hellphago
          text={text}
          onSpeechEnd={this.onSpeechEnd}
        />
      </div>
    )
  }

}

IndexPage.propTypes = {
  params: React.PropTypes.object,
  socket: React.PropTypes.object,
  readQuestion: React.PropTypes.func
}

export default connect(
  (state) => ({
    questions: state.questions.questions
  }), {
    readQuestion
  }
)(IndexPage)
