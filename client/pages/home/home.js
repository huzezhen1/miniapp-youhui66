/*<remove trigger="prod">*/
import {getpaoliang} from '../../lib/api-mock'
/*</remove>*/

/*<jdists trigger="prod">
import {getpaoliang} from '../../lib/api'
</jdists>*/

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '领券直播',
    swiperList: [],
    list: [],
    indicatorDots: true,  // 是否显示指示点
    autoplay: true  // 是否自动滑动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getpaoliang().then((res) => {
      console.log(res)
      // console.log(res.data.data.data)
      // console.log(res.data.data.cac_id)
      let result = res.result || res.data
      result && result.data && result.data.data && this.setData({
        list: result.data.data
      })
      wx.nextTick(() => {
        this.setData({
          swiperList: this.data.list.slice(0, 4)
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})