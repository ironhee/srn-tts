// Actions
const ADD_CHANNELS = 'srn-tts/questions/ADD_CHANNELS'

// Reducer
const initialState = {
  channels: []
}
export default function reducer (state = initialState, action = {}) {
  const { channels } = state

  switch (action.type) {
    case ADD_CHANNELS:
      return {
        ...state,
        channels: channels.concat(action.channels)
      }
    default:
      return state
  }
}

// Action Creators
export function addChannels (channels) {
  return { type: ADD_CHANNELS, channels }
}

export function fetchChannels () {
  return async (dispatch) => {
    const { channels } = await window.fetch('/channels').then(res => res.json())
    return dispatch(addChannels(channels))
  }
}
