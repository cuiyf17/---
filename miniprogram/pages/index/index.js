//index.js
const app = getApp()
var day = ["今天","明天","后天"];
var bmap = require('../../bmap-wx.min.js');
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime.js')

Page({
  data: {
    isClose:true, //判断当前页面是打开还是返回页
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    list: [],
    sentence: {},
    page: 2,
    num: 5,
    loading: false,
    isOver: false,
    day : day,
    ak: 'VwfXz17iAdcF8wWPHocvmzcSWEvuLGyy',
  },
  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function() {
    console.log('onLoad')
    this.getLocation();
    this.getSentence();
    this.getList();
    var BMap = new bmap.BMapWX({
      ak: this.data.ak
    })
  },
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + " lon:" + longitude);
 
        that.getCity(latitude, longitude);
      }
    })
  },
  
  //获取城市信息
  getCity: function (latitude, longitude) {
    var that = this
    
    var url = "https://api.map.baidu.com/reverse_geocoding/v3/?";
    var params = {
      ak: 'VwfXz17iAdcF8wWPHocvmzcSWEvuLGyy',
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
 
        that.setData({
          city: city,
          district: district,
          street: street,
        })
 
        var descCity = city.substring(0, city.length - 1);
        that.getWeahter(descCity);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
 
  //获取天气信息
  getWeahter: function (city) {
    var that = this
    var url = 'https://free-api.heweather.net/s6/weather/now?location='+city+'&key='+'212bd0415dbc4441be3063f8f2d4ec1f'
    var params = {
      city: city,
      key: "212bd0415dbc4441be3063f8f2d4ec1f"
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        var tmp = res.data.HeWeather6[0].now.tmp;
        var txt = res.data.HeWeather6[0].now.cond_txt;
        var code = res.data.HeWeather6[0].now.cond_code;
        //var qlty = res.data.HeWeather6[0].aqi.city.qlty;
        var dir = res.data.HeWeather6[0].now.wind_dir;
        var sc = res.data.HeWeather6[0].now.wind_sc;
        var hum = res.data.HeWeather6[0].now.hum;
        var fl = res.data.HeWeather6[0].now.fl;
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;
        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          //qlty: qlty,
          dir: dir,
          sc: sc,
          hum: hum,
          fl: fl,
          daily_forecast: daily_forecast
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  

  async getSentence() {
    let sentencePage = await this.asyncGetSentencePage()
    let res = await this.asyncGetSentence(sentencePage)
    let {_id, content, dynasty, name, poet} = res.data[0]
    let cont = ''
    if (content.length == 2) {
      cont = content[0] + content[1]
    } else {
      cont = content.slice(-2,-1)[0]
    }

    this.setData({
      sentence: {
        _id,
        cont,
        dynasty,
        name,
        poet
      },
    })
  },

  asyncGetSentence(page) {
    const db = wx.cloud.database()
    const _ = db.command
    return new Promise((resolve, reject) => {
      db.collection('xihujianyi').where({
        type: _.in(['guanjianzi'])
      }).skip(page).limit(1)
        .get({
          success (res) {
            wx.hideLoading()
            resolve(res)
          },
          fail (err) {
            reject(err)
          }
        })
    })
  },

  asyncGetSentencePage() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'xihujianyi',
          page: 1,
          num: 1,
          condition: {
            type: 'caizhi'
          }
        },
      }).then(res => {
          let pageNum = res.result.data[0].pageNum
          resolve(pageNum)
        })
        .catch(err=>{
          reject(err)
        })
    })

  },


  lower(e) {
    if (!this.data.loading) {
      this.getList()
    }
  },

  getList () {
    if (!this.data.isOver) {
      let {list, page, num} = this.data
      let that = this
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'xiaoyi',
          page,
          num,
          condition: {
            type: 'xihujianyi'
          }
        },
      }).then(res => {
          if(!res.result.data.length) {
            that.setData({
              loading: false,
              isOver: true
            })
          } else {
            let res_data = res.result.data
            list.push(...res_data)
            that.setData({
              list,
              page: page + 1,
              loading: false
            })
          }
        })
        .catch(console.error)
    }
  },

  goDetail (e) {
    let _id = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'collection_update',
      data: {
        id: _id
      },
    }).then(res => {
        this.setData({
          isClose: false
        })
        wx.navigateTo({
          url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
        })
      })
      .catch(console.error)
  },

  onShareAppMessage(res) {
    return {
      title: '快来学习洗护建议吧',
      path: `pages/index/index`
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    console.log('onUnload')
  },

})