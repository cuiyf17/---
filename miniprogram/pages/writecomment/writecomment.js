// pages/writecomment/writecomment.js
var timeUtil = require('../../utils/timeUtil.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogid: '',
    textareaInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages();
    var lastpage = pages[pages.length - 2];
    var info = lastpage.data;
    this.data.blogid = info._id
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
  writecommentBt: function() {
    const mycontent = this.data.textareaInput
    const mydatetime = timeUtil.formatTime(new Date())
    const myblogid = this.data.blogid
    const myopenid = app.globalData.openid
    if (mycontent == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入评论内容',
      })
      return
    }
    console.log(mycontent),
    console.log(mydatetime),
    console.log(myblogid),
    console.log(myopenid),
    wx.showLoading({
      title: '评论中',
      
    })

    wx.cloud.callFunction({
      name: 'addComment',
      
      data: {
        blogid: myblogid,
        openid: myopenid,
        commentdate: mydatetime,
        content: mycontent
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '评论成功',
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
          title: '评论失败',
        })
      }
    })
  }
})