// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async(event, context) => {
  var myuserid = event.userid
  var myquestiondate = event.questiondate
  var myquestion = event.question
  var myanswer = ''
  const _ = db.command

  await db.collection('Question').add({
    data: {
      userid: myuserid,
      questiondate: myquestiondate,
      question: myquestion,
      answer: myanswer
    }
  })
  return {
    msg: 'ok'
  }
}