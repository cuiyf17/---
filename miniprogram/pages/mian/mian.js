//获取应用实例

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    database: 'Xiaoyi',
    _id: "000000000",
    TabCur: 0,
    scrollLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.Load_jianyi()
  },
  Load_jianyi(){
    var that = this
    var db = wx.cloud.database()
    var _ = db.command

     db.collection(that.data.database)
      .where({_id:that.data._id})
      .field({
        caizhi: true,
        shouxi: true,
        jixi: true,
        ganxi: true,
        liangshai: true,
        txt: true
      })
      .get({
        success: function (res) {
        var txt = res.data[0].txt
        var caizhi = res.data[0].caizhi
        var shouxi = res.data[0].shouxi
        var jixi = res.data[0].jixi
        var ganxi = res.data[0].ganxi
        var liangshai = res.data[0].liangshai
        console.log(caizhi)
        that.setData({
        txt: txt,
        caizhi: caizhi,
        shouxi: shouxi,
        jixi: jixi,
        ganxi: ganxi,
        liangshai: liangshai,
        })  
        } 
        })
        
        db.collection("comment")
      .where({blogid:that.data._id})
      .field({
        content: true,
        commentdate: true,
      })
      .get({
        success: function (res) {
        var i = 0
        var comments = new Array();
        for(var i =0;i<res.data.length;i++){
          var comment ={
            content:res.data[i].content,
            date:res.data[i].commentdate,
          }
          comments.push(comment)
        }    
        that.setData({
        comments: comments,
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
    that.Load_jianyi()
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

  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  } ,

  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.TabCur
      currentPageIndex = (currentPageIndex + 1) % 3
      this.setData({
        TabCur: currentPageIndex
      })
    }
  },




})