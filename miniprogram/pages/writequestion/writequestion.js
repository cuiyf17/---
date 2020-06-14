// pages/writecomment/writecomment.js
var timeUtil = require('../../utils/timeUtil.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    textareaInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages();
    var lastpage = pages[pages.length - 2];
    var info = lastpage.data;
    this.data.userid = app.globalData.openid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  textareaInput(e) {
    this.setData({
      textareaInput: e.detail.value
    })
  },
  writequestionBt: function() {
    const myquestion = this.data.textareaInput
    const myquestiondate = timeUtil.formatTime(new Date())
    const myuserid = this.data.userid
    if (myquestion == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入提问内容',
      })
      return
    }
    console.log(myquestion),
    console.log(myquestiondate),
    console.log(myuserid),
    wx.showLoading({
      title: '提问中',
    })

    wx.cloud.callFunction({
      name: 'addQuestion',
      data: {
        userid: myuserid,
        questiondate: myquestiondate,
        question: myquestion
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '提问成功',
          icon: 'success',
          success: function() {
            setTimeout(function() {
              wx.navigateBack()
            }, 2000);
          }
        })
      },
      fail: function(res) {
        console.log(res)
        wx.showToast({
          icon: 'none',
          title: '提问失败',
        })
      }
    })
  }
})