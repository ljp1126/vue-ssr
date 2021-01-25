const Vue = require('vue')

const express = require('express')
const fs = require('fs')

const template = fs.readFileSync('./index.template.html', 'utf-8')

const renderer = require('vue-server-renderer').createRenderer({
  template
})

const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    template: `
      <div id="app">
        <h1>{{ message }}</h1>
      </div>
    `,
    data: {
      message: '你好吗？'
    }
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      return res.status(500).end('Internal Server Error.')
    }
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  })
})



server.listen(3333, () => {
  console.log('server running at port 3000.')
})