const APPID = "wx141f8ac89a46c335"
const APPSECRET = "xx"
const API_APPKEY = 'yxjjnty317'

const $ = {
  getWechatAppConfig() {
    return {
      id: APPID,
      sk: APPSECRET 
    }
  },
  getApiAppkey() {
    return {
      k: API_APPKEY
    }
  }
}
/*<remove>*/
module.exports = $
/*</remove>*/