const Vue = require('vue')

const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')



const isProd = process.env.NODE_ENV === 'production'

const server = express()

server.use('/dist', express.static('./dist'))

let renderer
let onReady

if (isProd) {
  const template = fs.readFileSync('./index.template.html', 'utf-8')

  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  // 开放模式 - 监视打包构建
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = createBundleRenderer(serverBundle, {
      template,
      clientManifest
    })
  })
}



const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: '你好吗',
      meta: `
        <meta name="description" content="我的学习">
      `,
      url: req.url
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (error) {
    res.status(500).end('服务端内部错误')
  }
  
}

server.get('*', isProd 
  ? render
  : async (req, res) => {
    await onReady
    render(req, res)
  }
)



server.listen(3333, () => {
  console.log('server running at port 3000.')
})