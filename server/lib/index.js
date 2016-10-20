const express = require('express')
const cors = require('cors')
const path = require('path')
const fp = require('lodash/fp')
const tts = require('./tts')
const db = require('./db')

// Slack bot
const SlackBot = require('slackbots')
const bot = new SlackBot({
  token: process.env.SLACK_BOT_TOKEN,
  name: process.env.SLACK_BOT_NAME
})

// HTTP
const app = express()
const server = require('http').createServer(app)

app.use(cors())
app.get('/channels', (req, res) => {
  bot.getChannels()
    .then(result => result.channels)
    .then(channels => fp.filter(channel => channel.is_member)(channels))
    .then(channels => res.json({ channels }))
    .catch(() => res.status(500).end())
})
app.get('/tts/:text', (req, res) => {
  if (!req.params.text) return res.status(500).end()
  const text = req.params.text.split('.mp3')[0]
  if (!text) return res.status(500).end()

  tts(text)
    .then(result => result.body.pipe(res.set('content-disposition', `attachment; filename="result.mp3";`)))
    .catch(() => res.status(500).end())
})

// Socket
const io = require('socket.io')(server)

io.on('connect', (socket) => {
  socket.on('channel:join', ({ channel }) => socket.join(channel))
  socket.on('channel:leave', ({ channel }) => socket.leave(channel))
})

bot.on('message', (data) => {
  if (!(data.type === 'message' && data.text && !data.subtype)) return
  Promise.all([
    bot.getUserById(data.user),
    bot.getChannelById(data.channel)
  ])
  .then(([user, channel]) => {
    const question = db.createQuestion({ question: data.text, user, channel })
    io.to(channel.name).emit('question:created', question)
  })
})

// Static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../../client/build')))
} else {
  app.use('/', require('express-http-proxy')('http://localhost:3000/'))
}

module.exports = server
