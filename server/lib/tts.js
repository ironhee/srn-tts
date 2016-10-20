const querystring = require('querystring')
const fetch = require('node-fetch')

const SUPPORTED_LANGUAGES = {
  KOREAN: 'Ko-kr'
}

function tts (text, lang = SUPPORTED_LANGUAGES.KOREAN) {
  const params = querystring.stringify({
    ie: 'UTF-8',
    total: 1,
    idx: 0,
    textlen: 32,
    client: 'tw-ob',
    q: text,
    tl: lang
  })
  return fetch(`http://translate.google.com/translate_tts?${params}`)
}

module.exports = tts
