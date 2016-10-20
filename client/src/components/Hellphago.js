import React, { Component } from 'react'
import { Howl } from 'howler'
import SiriWave from 'siriwavejs'
import $ from 'jquery'
import './Hellphago.css'

class Hellphago extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false
    }
  }

  componentDidMount () {
    const audioWaveWidth = $(this.$hellphago).innerWidth() / 1.5
    const audioWaveHeight = $(this.$hellphago).innerHeight() / 2
    this.audioWave = new SiriWave({
      container: this.$audioWave,
      width: audioWaveWidth,
      height: audioWaveHeight,
      color: '#555',
      speed: 0.1,
      frequency: 3,
      amplitude: 0,
      autostart: true
    })
    this.audioWave.setAmplitude(0)

    if (this.props.text) {
      this.tts(this.props.text)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.text && nextProps.text !== this.props.text) {
      this.tts(nextProps.text)
    }
  }

  tts (text) {
    const url = `/tts/${encodeURIComponent(text)}.mp3`
    this.audioWave.setAmplitude(0.05)
    const sound = new Howl({
      src: [url],
      onplay: () => {
        this.audioWave.setAmplitude(1)
        this.setState({ isPlaying: true })
        if (this.props.onSpeechStart) {
          this.props.onSpeechStart(text)
        }
      },
      onend: () => {
        this.audioWave.setAmplitude(0)
        this.setState({ isPlaying: false })
        if (this.props.onSpeechEnd) {
          this.props.onSpeechEnd(text)
        }
      }
    })
    sound.play()
  }

  render () {
    const { text } = this.props
    const { isPlaying } = this.state
    return (
      <div id='Hellphago' ref={(c) => { this.$hellphago = c }}>
        <div id='main-section'>
          <div id='audio-wave' ref={(c) => { this.$audioWave = c }} />
        </div>
        <div id='overlay-section'>
          <div id='audio-desc'>
            { text && isPlaying ? <h2>{ text }</h2> : null }
          </div>
        </div>
      </div>
    )
  }

}

Hellphago.propTypes = {
  text: React.PropTypes.string
}

export default Hellphago
