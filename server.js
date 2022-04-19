const http = require('http')
const mongoose = require('mongoose')
const Post = require('./models/post')
const { HEADER } = require('./constants')
const { successResponse, errorResponse } = require('./responseHandle')

require('dotenv').config()

mongoose.connect(process.env.DB_CONNECT)
  .then(() => { console.log('DB connect ok') })
  .catch((e) => { console.error(e) })

const requestListener = async (req, res) => {
  let body = ''
  try {
    await new Promise((resolve, reject) => {
      req
        .on('data', chunk => body += chunk)
        .on('end', () => resolve())
        .on('error', e => reject(e))
    })
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '執行有誤')
  }

  if (req.url === '/posts' && req.method === 'GET') {
    try {
      const posts = await Post.find()
      successResponse(res, 200, posts)
    } catch (e) {
      console.error(e)
      errorResponse(res, 400, '取得 Posts 有誤')
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    try {
      const content = JSON.parse(body)
      await Post.create(content)

      const posts = await Post.find()
      successResponse(res, 200, posts)
    } catch (e) {
      console.error(e)
      errorResponse(res, 400, '建立 Post 有誤')
    }
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    try {
      await Post.deleteMany({})
      successResponse(res, 200, [])
    } catch (e) {
      console.error(e)
      errorResponse(res, 400, '刪除 Posts 有誤')
    }
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop()
      const result = await Post.findByIdAndDelete(id)

      if (result) {
        const posts = await Post.find()
        successResponse(res, 200, posts)
      } else {
        errorResponse(res, 400, '查無 Post')
      }
    } catch (e) {
      console.error(e)
      errorResponse(res, 400, '刪除 Post 有誤')
    }
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    try {
      const id = req.url.split('/').pop()
      const content = JSON.parse(body)
      const result = await Post.findByIdAndUpdate(id, content)

      if (result) {
        const posts = await Post.find()
        successResponse(res, 200, posts)
      } else {
        errorResponse(res, 400, '查無 Post')
      }
    } catch (e) {
      console.error(e)
      errorResponse(res, 400, '更新 Post 有誤')
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, HEADER)
    res.end()
  } else {
    errorResponse(res, 404, '無此路由')
  }
}

const server = http.createServer(requestListener)
server.listen(process.env.PORT || 3000)