/*<remove trigger="prod">*/
import {jscode2session} from '../../lib/api-mock'
/*</remove>*/

/*<jdists trigger="prod">
import {jscode2session} from '../../lib/api'
</jdists*/

const app = getApp()
const globalData = app.globalData

Page({
  data: {
    avatarUrl: globalData.avatarUrl,
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    nickName: ''
  },

  getScope(success, fail, name = 'scope.userInfo') {
    wx.getSetting({  // 获取用户授权设置, 返回值中只会出现小程序已经向用户请求过的权限
      success: (res) => {
        if(res.authSetting[name]) { // 已经授权成功
          typeof success === 'function' && success()
        } else {  // 未授权
          typeof fail === 'function' && fail()
        }
      }
    })
  },

  /**
   * 获取用户 openid
   */
  getUserOpenId(success, fail) {
    wx.login({  // 弹窗，确定授权就会获得一个临时code，然后用这个code去请求jscode2session，获取 openid 和 session_key
      success: (res) => {
        jscode2session(res.code).then((res) => {
          let {openid, session_key} = res.result
          if(openid && session_key) {
            // 授权成功，存储openid和session_key
            wx.setStorage({
              openid: openid,
              key: session_key
            })
            // 执行成功操作
            typeof success === 'function' && success(res) 
          } else {
            // 授权失败
            typeof fail === 'function' && fail()
          }
        })
      }
    })
  },

  /**
   * 调用微信接口来获取用户信息
   */
  _getUserInfo_getUserInfo(callback = () => {}) {
    wx.getUserInfo({  // 获取用户信息，需要授权
      success: (res) => {
        callback(res.userInfo)
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    if(!(globalData.nickName || globalData.avatarUrl)) {  // 如果全局数据中没有
      this._getUserInfo((rs) => {
        this.setData({
          'nickName': rs.nickName,
          'avatarUrl': rs.avatarUrl
        })
        globalData.nickName = rs.nickName
        globalData.avatarUrl = rs.avatarUrl
      })
    }

    let that = this
    let openid = wx.getStorageSync('openid')  // 在本地存储中获取 openid

    function callback() {
      wx.showToast({
        title: '获取openid成功' + that.openid
      })
    }

    if(openid) {  // 如果本地存储有 openid
      callback()
    } else {
      this.getUserOpenId((res) => {
        // success 函数
        openid = res.result.openid
        callback()
      }, () => {
        // fail 函数
        wx.showToast({
          title: '获取openid失败'
        })
      })
    }
  },

  onLoad() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.getScope(this.getUserInfo, () => {
      wx.showToast({
        title: '未授权'
      })
    })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '还未授权'
    //       })
    //     }
    //   }
    // })
  },

  // onGetUserInfo(e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  onGetOpenid() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  }

})
