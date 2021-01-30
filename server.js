const Vue = require('vue')

const express = require('express')
const fs = require('fs')

const template = fs.readFileSync('./index.template.html', 'utf-8')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  template,
  clientManifest
})

const server = express()

server.use('/dist', express.static('./dist'))

server.get('/', (req, res) => {

  renderer.renderToString({
    title: '你好吗',
    meta: `
      <meta name="description" content="我的学习">
    `,
  }, (err, html) => {
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