//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    database: 'Question',
    userid: app.globalData.openid,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.Load_question()
  },
  Load_question(){
    var that = this
    var db = wx.cloud.database()
    var _ = db.command

        db.collection("Question")
      .where({userid:that.data.userid})
      .field({
        question: true,
        answer: true,
      })
      .get({
        success: function (res) {
        var i = 0
        var questions = new Array();
        for(var i =0;i<res.data.length;i++){
          var content ={
            question:res.data[i].question,
            answer:res.data[i].answer,
          }
          questions.push(content)
        }    
        that.setData({
        questions: questions,
        })  
        } 
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
    var that = this
    that.Load_question()
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