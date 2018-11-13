const path = require('path') 
const express = require('express')
const {PORT} = require('../config.server.json')
const jscode2session = require('./cloudfunctions/jscode2session/').main
const getpaoliang = require('./cloudfunctions/getPaoliang/').main
const gettop100 = require('./cloudfunctions/gettop100/').main
const getwhole = require('./cloudfunctions/getwhole/').main
const app = express()

app.listen(PORT, () => {
  console.log(`服务器开启成功: http://127.0.0.1:${PORT}`)
})

/**
 * 实现静态资源服务
 * 一些知识点：
 *    __dirname表示程序运行的根目录
 *    path.join()表示path模块调用join方法将参数的路径拼接起来
 *    一般这样app.use(express.static('public'))就可以直接访问public目录下的静态文件，这样访问：http://localhost:3000/images/kitten.jpg
 *    如果是app.use('/static', express.static('public'))则表示设置一个虚拟的目录为/static，访问的时候是这样：http://localhost:3000/static/images/kitten.jpg
 */
app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false, // 设为false表示禁用目录索引，默认值的是"index.html"
    maxage: '30d' // 设置缓存的最大期限为30天
  })
)

app.get('/api/jscode2session', (req, res, next) => {
  jscode2session(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.get('/api/getpaoliang', (req, res, next) => {
  getpaoliang(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.get('/api/gettop100', (req, res, next) => {
  gettop100(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.get('/api/getwhole', (req, res, next) => {
  getwhole(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

