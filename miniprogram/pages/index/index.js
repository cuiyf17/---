//index.js
const app = getApp()
var day = ["今天","明天","后天"];
var bmap = require('../../bmap-wx.min.js');
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime.js')

Page({
  data: {
    _id: "F00000000",
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
    var url2 = 'https://free-api.heweather.net/s6/weather/lifestyle?location='+city+'&key='+'212bd0415dbc4441be3063f8f2d4ec1f'
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
        var pcpn = res.data.HeWeather6[0].now.pcpn;
        //var daily_forecast = res.data.HeWeather6[0].daily_forecast;
        var advice = "今天有降雨，不适合晾晒哦~";
        if(pcpn > 0){
          advice = "今天有降雨，不适合晾晒哦~"
        }
        else if(txt == "晴" && tmp >= 30){
          advice = "今天有暴晒，晾晒时间不宜过长~"
        }
        else{
          advice = "今天可以晾晒哦~"
        }
        if(sc>=6){
          advice = "今天风力很大，小心衣服被吹跑哦~"
        }
        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          //qlty: qlty,
          dir: dir,
          sc: sc,
          hum: hum,
          pcpn: pcpn,
          advice: advice,
          //daily_forecast: daily_forecast
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.request({
      url: url2,
      data: params,
      success: function (res) {
        var brf = res.data.HeWeather6[0].lifestyle[1].brf;
        that.setData({
          brf: brf,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
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