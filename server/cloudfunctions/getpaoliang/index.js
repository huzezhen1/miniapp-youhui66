const API_URL = 'http://youhui66.cn/index.php'
const request = require('request')
const querystring = require('querystring')

exports.main = async (event) => {
  const data = {
    r: 'index/ajaxnew',
    page: 1
  }
  let url = API_URL + '?' + querystring.stringify(data)
  return new Promise((resolve, reject) => {
    request.get(url, (error, res, body) => {
      if(error || res.statusCode !== 200) {
        reject(error)
      } else {
        try {
          const r = JSON.parse(body)
          resolve(r)
        } catch(e) {
          reject(e)
        }
      }
    })
  })
} 