/**
 * 调用微信接口获取openid
 */
export const jscode2session = (code) => {
  return wx.cloud.callFunction({
    name: 'jscode2session',
    data: {
      code
    }
  })
}

/**
 * 调用“领券直播”接口
 */
export const getpaoliang = () => {
  return wx.cloud.callFunction({
    name: 'getpaoliang'
  })
}
