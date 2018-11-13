import Promise from './bluebird'

/**
 * jscode2session函数，传入code来获取openid和session_key 
 */
export const jscode2session = (code) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/jscode2session',
      data: {
        code
      },
      success: (res) => {
        resolve({result: res.data})
      },
      fail: reject
    })
  })
}

/**
 * 实时跑量 - 领券直播
 */
export const getpaoliang = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/getpaoliang',
      data: {
        // r: 'index/ajaxnew',
        // page: 1
      },
      success: (res) => {
        resolve(res)
      },
      fail: reject
    })
  })
}

/**
 * top100
 */
export const gettop100 = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/gettop100',
      data: {
        // r: 'Port/index',
        // type: 'top100',
        // appkey: 'yxjjnty317',
        // v: 2
      },
      success: (res) => {
        resolve(res)
      },
      fail: reject
    })
  })
}

/**
 * 全站
 */
export const getwhole = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/getwhole',
      data: {
        // r: 'Port/index',
        // type: 'total',
        // appkey: 'yxjjnty317',
        // v: 2,
        // page: 1
      },
      success: (res) => {
        resolve(res)
      },
      fail: reject
    })
  })
}
