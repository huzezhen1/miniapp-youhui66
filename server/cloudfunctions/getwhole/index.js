const API_URL = 'http://api.dataoke.com/index.php'
const request = require('request')
const querystring = require('querystring')
/*<jdists import="../../inline/utils.js">*/

/*<remove trigger="prod">*/
const $ = require('../../inline/utils')
/*</remove>*/

exports.main = async (event) => {
  const {k} = $.getApiAppkey()
  const data = {
    r: 'Port/index',
    type: 'total',
    appkey: k,
    v: 2,
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