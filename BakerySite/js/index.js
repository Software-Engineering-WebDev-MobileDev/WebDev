const express = require('express')
const nunjucks = require('nunjucks')

var app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.set('view engine', 'html')

const PORT = '3000'

app.get('/', (req, res) => {
  res.render('base.html')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})