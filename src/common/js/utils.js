import {
  defaultLogo,
  defaultTime,
  defaultType,
  defaultLecture,
  defaultSponsor,
  defaultTitle,
  HOST,
  defaultCity
} from '../../api/config'
import {SET_LATESTPLAY_MEETING_LIST, SET_PHONE_CONTACT_LIST} from '../../store/mutation-types'
import store from '../../store'
import {eventCenter} from '../../api/native'
import pinyin from '../../common/js/pin-yin'

// 会议对象创建
export class Meeting {
  constructor(item) {
    this.id = item.id
    this.imgUrl = item.logoUrl ? HOST + '/' + item.logoUrl : defaultLogo
    this.title = item.title || defaultTitle
    this.broadcastType = item.broadcastType || defaultType
    this.meetingTime = genMeetingTime(item.startTime, item.endTime)
    this.lecturer = (item.lecturers.length < 1 || !item.lecturers[0].name) ? defaultLecture : item.lecturers[0].name + (item.lecturers[0].title ? '(' + item.lecturers[0].title + ')' : '')
    this.sponsor = (item.sponsors.length < 1 || !item.sponsors[0].name) ? defaultSponsor : item.sponsors[0].name
    this.recommend = item.recommend
    this.pdfId = item.pdfId
    this.audioId = item.audioId
    this.meetingStatus = item.meetingStatus
    this.signunpStatus = item.signupStatus
    this.isRestricted = item.isRestricted ? 'restricted' : 'notRestricted'
  }
}

export const genMeetingListItem = (item) => {
  let listItem = {}
  // 会议Id
  listItem.id = item.id
  // 会议Logo
  if (!item.logoUrl) {
    listItem.imgUrl = defaultLogo
  } else {
    listItem.imgUrl = HOST + '/' + item.logoUrl
    // TODO
  }
  // 会议标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
  // 会议广播类型：电话、音频、视频
  if (!item.broadcastType) {
    listItem.broadcastType = item.broadcastType
  } else {
    listItem.broadcastType = item.broadcastType
  }
  // 会议时间
  listItem.meetingTime = genMeetingTime(item.startTime, item.endTime)

  // 会议主讲人
  if (item.lecturers.length < 1 || !item.lecturers[0].name) {
    listItem.lecturer = defaultLecture
  } else {
    listItem.lecturer = item.lecturers[0].name + (item.lecturers[0].title ? '(' + item.lecturers[0].title + ')' : '')
  }
  // 会议主办方
  if (item.sponsors.length < 1 || !item.sponsors[0].name) {
    listItem.sponsor = defaultSponsor
  } else {
    listItem.sponsor = item.sponsors[0].name
  }
  // 推荐会议
  listItem.recommend = item.recommend
  // 会议资料
  listItem.pdfId = item.pdfId
  listItem.audioId = item.audioId
  // 会议状态
  listItem.meetingStatus = item.meetingStatus
  // 已报名
  listItem.signupStatus = item.signupStatus
  // 是否限制会议
  if (item.isRestricted) {
    listItem.isRestricted = 'restricted'
  } else {
    listItem.isRestricted = 'notRestricted'
  }
  return listItem
}

// 会议资讯对象
export const genMeetingInfoListItem = item => {
  let listItem = {}
  // 会议资讯 标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
  // 会议资讯 城市
  if (!item.city) {
    listItem.city = defaultCity
  } else {
    listItem.city = item.city
  }
  // 会议资讯 日期
  if (!item.date) {
    listItem.date = defaultTime
  } else {
    listItem.date = item.date
  }
  // 会议资讯 主办方
  if (!item.sponsor) {
    listItem.infoSponsor = defaultSponsor
  } else {
    listItem.infoSponsor = item.sponsor
  }
  // 会议资讯 链接url
  listItem.url = item.url
  return listItem
}

// 私人会议对象
export const genPrivateMeetingList = (item) => {
  let listItem = {}
  // 会议ID
  listItem.id = item.id
  // 会议室密码
  if (!item.meetingCode) {
    listItem.meetingCode = '会议室密码待定'
  } else {
    listItem.meetingCode = item.meetingCode
  }
// 会议标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
// 会议创建人
  if (!item.createName) {
    listItem.createName = 'null'
  } else {
    listItem.createName = item.createName
  }
// 会议时间
  if (!item.startTime) {
    listItem.startTime = defaultTime
  } else {
    let startDate = new Date(item.startTime)
    let meetingYeay = startDate.getYear()
    let thisYear = new Date().getYear()
    if (meetingYeay === thisYear) {
      listItem.startTime = startDate.format('MM-dd EE HH:mm')
      let meetingStartDay = startDate.format('yyyyMMdd')
      let todayStr = new Date().format('yyyyMMdd')
      let dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let todayWeekDay = '今天'
      if (meetingStartDay === todayStr) {
        listItem.startTime = listItem.startTime.replace(dayArr[startDate.getDay()], todayWeekDay)
      }
    } else {
      listItem.startTime = startDate.format('yyyy-MM-dd HH:mm')
    }

    if (item.endTime) {
      var endDate = new Date(item.endTime)
      listItem.startTime += '-' + endDate.format('HH:mm')
    }
  }
// 会议室编号
  if (!JSON.parse(item.meetingRoom).roomNo) {
    listItem.roomNo = 'null'
  } else {
    listItem.roomNo = JSON.parse(item.meetingRoom).roomNo
  }
  return listItem
}

//会议时间过滤
export const genMeetingTime = (startTime, endTime) => {
  let meetingTime = null
  if (!startTime) {
    meetingTime = defaultTime
  } else {
    let startDate = new Date(startTime)
    meetingTime = startDate.format('yyyy-MM-dd EE HH:mm')
    let meetingStartDay = startDate.format('yyyyMMdd')
    let todayStr = new Date().format('yyyyMMdd')
    let dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let todayWeekDay = '今天'
    if (meetingStartDay === todayStr) {
      meetingTime = meetingTime.replace(dayArr[startDate.getDay()], todayWeekDay)
    }
    if (endTime) {
      let endDate = new Date(endTime)
      meetingTime += '-' + endDate.format('HH:mm')
    }
  }
  return meetingTime
}

const minute = 60 * 1000 // 1分钟
const hour = 60 * minute // 1小时
const day = 24 * hour // 1天
const month = 31 * day // 1月
const year = 12 * month // 1年
/**
 * 返回文字描述的日期
 *
 * @param date
 * @return
 */
export const getTimeFormatText = (date) => {
  if (date == null) {
    return null
  }
  let diff = new Date().getTime() - date.getTime()
  let r = 0
  if (diff > year) {
    r = parseInt(diff / year)
    return r + '年前'
  }
  if (diff > month) {
    r = parseInt(diff / month)
    return r + '个月前'
  }
  if (diff > day) {
    r = parseInt(diff / day)
    return r + '天前'
  }
  if (diff > hour) {
    r = parseInt(diff / hour)
    return r + '个小时前'
  }
  if (diff > minute) {
    r = parseInt(diff / minute)
    return r + '分钟前'
  }
  return '刚刚'
}

Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  }
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

//获取最近播放列表
export const getLatestPlayArray = () => {
  let latestPlayArray = []
  // 没有任何相关记录，直接返回空数组
  if (!localStorage.latestPlay) {
    return latestPlayArray
  }
  console.log(localStorage.latestPlay)

  let latestPlayJson = JSON.parse(localStorage.latestPlay)
  // 查找匹配记录
  for (let element of latestPlayJson) {
    console.log(store.getters.userCrmId)
    if (element.crmId === store.getters.userCrmId) {
      latestPlayArray = element.latestPlayArray
      break
    }
  }
  return latestPlayArray
}

//设置最近播放列表
export const setLatestPlayArray = (latestPlayArray) => {
  // 没有任何相关记录，新建一条记录
  if (!localStorage.latestPlay) {
    let latestPlayList = []
    let latestPlayListItem = {}
    latestPlayListItem.crmId = store.getters.userCrmId
    latestPlayListItem.latestPlayArray = latestPlayArray
    latestPlayList.push(latestPlayListItem)
    localStorage.latestPlay = JSON.stringify(latestPlayList)
    return
  }
  // 包含至少一条记录
  let latestPlayJson = JSON.parse(localStorage.latestPlay)
  let hasCrmId = false
  // 查找匹配记录
  for (let element of latestPlayJson) {
    console.log(store.getters.userCrmId)
    if (element.crmId === store.getters.userCrmId) {
      element.latestPlayArray = latestPlayArray
      hasCrmId = true
      break
    }
  }
  // 不包含匹配记录，插入一条记录
  if (!hasCrmId) {
    let latestPlayListItem = {}
    latestPlayListItem.crmId = store.getters.userCrmId
    latestPlayListItem.latestPlayArray = latestPlayArray
    latestPlayJson.push(latestPlayListItem)
    localStorage.latestPlay = JSON.stringify(latestPlayJson)
    return
  }
  localStorage.latestPlay = JSON.stringify(latestPlayJson)
}

//最近播放去重
export const addToLatestPlay = (latestPlayArray, item) => {
  for (let index in latestPlayArray) {
    if (latestPlayArray[index].id === item.id) {
      latestPlayArray.splice(index, 1)
      break
    }
    if (latestPlayArray.length >= 20) {
      latestPlayArray.pop()
    }
  }
  latestPlayArray.unshift(item)
  store.commit(SET_LATESTPLAY_MEETING_LIST, latestPlayArray)
  setLatestPlayArray(latestPlayArray)
}

// 会议详情对象
export const genMeetingDetailItem = (item) => {
  let detail = {}
  //会议编号
  detail.id = item.id
  //会议标题
  detail.title = item.title ? item.title : defaultTitle
  //会议广播类型
  detail.broadcastType = item.broadcastType ? item.broadcastType : defaultType
  //会议简介
  detail.description = item.description
  //会议议程
  detail.agenda = item.agenda
  //会议时间
  detail.meetingTime = genMeetingTime(item.startTime, item.endTime)
  //会议主讲人
  detail.lecturers = []
  if (item.lecturers.length < 1) detail.lecturers.push(defaultLecture)
  for (let lecture of item.lecturers) {
    let lctr = {}
    lctr.name = lecture.name
    lctr.intro = lecture.name + (lecture.title ? '(' + lecture.title + ')' : '')
    lctr.description = lecture.description
    detail.lecturers.push(lctr)
  }
  //会议主办方
  detail.sponsors = []
  if (item.sponsors.length < 1) detail.sponsors.push(defaultSponsor)
  for (let sponsor of item.sponsors) {
    let spnsr = {}
    spnsr.name = sponsor.name
    detail.sponsors.push(spnsr)
  }
  //会议状态
  detail.meetingStatus = item.meetingStatus
  //收藏状态
  detail.bookmarkStatus = item.bookmarkStatus
  //报名状态
  detail.signupStatus = item.signupStatus
  //音频编号
  detail.audioId = item.audioId
  //会议室及播放地址
  detail.meetingRoom = item.meetingRoom
  //附件和速记？ attachments,pdfId, pptId, audioId

  return detail
}

//评论对象
export const genCommentItem = item => {
  let comment = {}
  //运营crmId
  const adminList = [1226872, 1403545, 1211961, 2670541, 2506835, 1226861]
  comment.authorName = adminList.includes(item.author.crmId) ? '3C小秘书' : item.author.name
  comment.commentTime = getTimeFormatText(new Date(item.commentTime))
  comment.content = item.content

  return comment
}

//手机联系人列表
export const getPhoneContacts = () => {
  getContacts(genPhoneContactList)
}

export const getContacts = (callback) => {
  console.log('call native getContacts', callback.name)
  eventCenter().getContacts(callback)
}

export const genPhoneContactList = (content) => {
  let contacts = JSON.parse(content)
  console.log(contacts)
  let phoneContactsList = getGroupContacts(contacts)
  store.commit(SET_PHONE_CONTACT_LIST, phoneContactsList)
}

export const getGroupContacts = (contactInfos) => {
  let contactMap = new Map()
  for (let contactInfo of contactInfos) {
    let newContactInfo = {}
    newContactInfo.name = contactInfo.FamilyName
    newContactInfo.phoneNum = contactInfo.Phone && contactInfo.Phone.length > 0 ? contactInfo.Phone[0] : ''
    if (newContactInfo.name) {
      let key = pinyin.getCamelChar(newContactInfo.name)
      key = key < 'A' || key > 'Z' ? '#' : key
      let contactList = contactMap.get(key)
      if (contactList === null || typeof (contactList) === 'undefined') {
        contactList = []
        contactMap.set(key, contactList)
      }
      contactList.push(newContactInfo)
    }
  }
  let groupContacts = []
  for (let [key, value] of contactMap) {
    let groupContactInfo = {}
    groupContactInfo.key = key
    console.log(key)
    groupContactInfo.userList = value
    groupContactInfo.userList.sort((a, b) => {
      return pinyin.getFullChars(a.name) > pinyin.getFullChars(b.name) ? 1 : -1
    })
    groupContacts.push(groupContactInfo)
  }
  groupContacts.sort((a, b) => {
    if (a.key === '#') {
      return 1
    } else if (b.key === '#') {
      return -1
    }
    return a.key > b.key ? 1 : -1
  })
  return groupContacts
}

//iWand联系人列表
export const genIWandContactList = (userListGroup, userAvatarList) => {
  let index = 0
  for (let users of userListGroup) {
    let arr = []
    for (let user of users.userList) {
      let u = {}
      //姓名
      u.name = user.userName
      //手机号
      u.phoneNum = user.mobilePhone
      //imId
      u.imId = user.iMID
      //公司
      u.company = user.company
      //头像
      u.avatar = userAvatarList[index++].iconData
      arr.push(u)
    }
    users.userList = arr
  }
  return userListGroup
}

//判断中文开始
export const isStartWithChinese = (str) => {
  const regex = /^[\u4e00-\u9fa5]+.*?$/
  return regex.test(str)
}

//判断英文开始
export const isStartWithEnglish = (str) => {
  const regex = /^[a-zA-Z0-9_]+.*?$/
  return regex.test(str)
}
