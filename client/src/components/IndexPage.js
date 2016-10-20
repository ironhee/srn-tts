import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import fp from 'lodash/fp'
import { fetchChannels } from '../redux/modules/channels'

class IndexPage extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.fetchChannels()
  }

  render () {
    const { channels } = this.props
    return (
      <div id='IndexPage' className='page'>
        <h1>Channels</h1>
        <ul>
          { fp.map(channel =>
            <li key={channel.id}><Link to={`/c/${channel.name}`}>{channel.name} ({channel.members.length})</Link></li>
          )(channels) }
        </ul>
      </div>
    )
  }

}

IndexPage.propTypes = {
  channels: React.PropTypes.array,
  fetchChannels: React.PropTypes.func
}

export default connect(
  (state) => ({
    channels: state.channels.channels
  }), {
    fetchChannels
  }
)(IndexPage)
