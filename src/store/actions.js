import * as types from './actionTypes'
import {getCalendarDate, reqSchedule} from '@/utils'
import format from 'date-fns/format'
import Parser from '@/libs/parser'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import Reminder from '@/libs/Reminder'
import OAuth from '@/libs/OAuth'
import Popup from 'obigo-js-ui-rnbs/components/popup'
import router from '@/router'

export function showLoading ({commit}) {
  commit(types.SHOW_LOADING)
}
export function hideLoading ({commit}) {
  commit(types.HIDE_LOADING)
}
export function updateSelMonth ({commit}, month) {
  commit(types.UPDATE_SEL_MONTH, month)
}
export function updateSelWeek ({commit}, week) {
  commit(types.UPDATE_SEL_WEEK, week)
}
export function updateSelDay ({commit}, date) {
  commit(types.UPDATE_SEL_DAY, date)
}
export function updateIsLogin ({commit}, isLogin) {
  commit(types.UPDATE_IS_LOGIN, isLogin)
}

/* 스케쥴 데이터 초기화 action */
export function initData ({commit}) {
  const now = new Date()
  commit(types.UPDATE_MONTH_SCHEDULE, {})
  commit(types.UPDATE_WEEK_SCHEDULE, {})
  commit(types.UPDATE_DAY_SCHEDULE, [])
  commit(types.UPDATE_SEL_MONTH, new Date(now))
  commit(types.UPDATE_SEL_WEEK, new Date(now))
  commit(types.UPDATE_SEL_DAY, new Date(now))
}
/******************************/
let count = 1
export async function updateMonthSchedule ({commit}, date) {
  if (!OAuth.isLogin()) {
    commit(types.UPDATE_SEL_MONTH, date)
    return
  }

  commit(types.SHOW_LOADING)
  try {
    const {start, end} = getCalendarDate({year: date.getFullYear(), month: date.getMonth()})
    const timeMin = new Date(start)
    const timeMax = end
    timeMin.setDate(timeMin.getDate() - 1)

    Reminder.update()
    const monthSch = await reqSchedule({timeMin, timeMax})
    const parsedData = await Parser.periodParser(monthSch.data, {
      start: format(start, 'YYYY-MM-DD'),
      end: format(end, 'YYYY-MM-DD')
    })
    commit(types.UPDATE_SEL_MONTH, date)
    commit(types.UPDATE_MONTH_SCHEDULE, parsedData)
    router.push('month')
  } catch (e) {
    console.log('--------------------------error')
    // console.log(JSON.parse(e.request.response).error.message)
    if (e === 'Invalid Credentials') {
      const normalP = Popup.show({
        title: 'SESSION',
        content: 'LOGOUT??',
        buttons: [{
          label: 'OK',
          onClick: () => {
            OAuth.logout()
            this.commit(types.UPDATE_IS_LOGIN, false)
            normalP.close()
          }
        },
        {
          label: 'RE LOGIN',
          onClick: function () {
            console.log('remind cancel')
            normalP.close()
          }
        }]
      })
    } else {
      if (count !== 3) {
        const networkP = Popup.show({
          title: 'NO NETWORK',
          content: 'Network is not connected \nPlease check your network?',
          buttons: [{
            label: 'Retry',
            onClick: () => {
              console.log(count)
              this.commit(types.UPDATE_NETERRCOUNT, count++)
              this.dispatch('updateMonthSchedule', this.getters.selMonth)
              networkP.close()
            }
          },
          {
            label: 'DISMISS',
            onClick: function () {
              console.log('remind cancel')
              networkP.close()
            }
          }]
        })
      } else {
        count = 0
        const errP = Popup.show({
          title: 'RETRY FAILED',
          content: 'You Have exceeded 3 attempts',
          buttons: [{
            label: 'OK',
            onClick: () => {
              errP.close()
              window.applicationFramework.applicationManager.getOwnerApplication(window.document).back()
            }
          }]
        })
      }
    }
  } finally {
    commit(types.HIDE_LOADING)
  }
}
export async function updateWeekSchedule ({commit}, date) {
  if (!OAuth.isLogin()) {
    commit(types.UPDATE_SEL_WEEK, date)
    return
  }
  commit(types.SHOW_LOADING)
  try {
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    const timeMin = new Date(start)
    const timeMax = end
    timeMin.setDate(timeMin.getDate() - 1)

    Reminder.update()
    const weekSch = await reqSchedule({timeMin, timeMax})
    const parsedData = await Parser.periodParser(weekSch.data, {
      start: format(start, 'YYYY-MM-DD'),
      end: format(end, 'YYYY-MM-DD')
    })
    commit(types.UPDATE_SEL_WEEK, date)
    commit(types.UPDATE_WEEK_SCHEDULE, parsedData)
    router.push('week')
  } catch (e) {
    console.log('--------------------------error')
    console.log(e)
    // const errReason = JSON.parse(e.request.response)
    // console.log('error: ', errReason.error.message)
    if (e === 'Invalid Credentials') {
      const normalP = Popup.show({
        title: 'SESSION',
        content: 'LOGOUT??',
        buttons: [{
          label: 'OK',
          onClick: () => {
            OAuth.logout()
            this.commit(types.UPDATE_IS_LOGIN, false)
            normalP.close()
          }
        },
        {
          label: 'RE LOGIN',
          onClick: function () {
            console.log('remind cancel')
            normalP.close()
          }
        }]
      })
    } else {
      if (count !== 3) {
        const networkP = Popup.show({
          title: 'NO NETWORK',
          content: 'Network is not connected \nPlease check your network?',
          buttons: [{
            label: 'Retry',
            onClick: () => {
              console.log(count)
              this.commit(types.UPDATE_NETERRCOUNT, count++)
              this.dispatch('updateWeekSchedule', this.getters.selMonth)
              networkP.close()
            }
          },
          {
            label: 'DISMISS',
            onClick: function () {
              console.log('remind cancel')
              networkP.close()
            }
          }]
        })
      } else {
        count = 0
        const errP = Popup.show({
          title: 'RETRY FAILED',
          content: 'You Have exceeded 3 attempts',
          buttons: [{
            label: 'OK',
            onClick: () => {
              errP.close()
              window.applicationFramework.applicationManager.getOwnerApplication(window.document).back()
            }
          }]
        })
      }
    }
  } finally {
    commit(types.HIDE_LOADING)
  }
}
export async function updateDaySchedule ({commit}, date) {
  if (!OAuth.isLogin()) {
    commit(types.UPDATE_SEL_DAY, date)
    return
  }
  commit(types.SHOW_LOADING)
  try {
    const timeMin = new Date(date)
    const timeMax = date
    timeMin.setDate(timeMin.getDate() - 1)

    Reminder.update()
    const daySch = await reqSchedule({timeMin, timeMax})
    const parsedData = await Parser.dailyParser(daySch.data, format(date, 'YYYY-MM-DD'))
    console.log('daily', parsedData)
    commit(types.UPDATE_SEL_DAY, date)
    commit(types.UPDATE_DAY_SCHEDULE, parsedData)
    router.push('day')
  } catch (e) {
    console.log('--------------------------error')
    console.log(e)
    // const errReason = JSON.parse(e.request.response)
    // console.log('error: ', errReason.error.message)
    if (e === 'Invalid Credentials') {
      const normalP = Popup.show({
        title: 'SESSION',
        content: 'LOGOUT??',
        buttons: [{
          label: 'OK',
          onClick: () => {
            OAuth.logout()
            this.commit(types.UPDATE_IS_LOGIN, false)
            normalP.close()
          }
        },
        {
          label: 'RE LOGIN',
          onClick: function () {
            console.log('remind cancel')
            normalP.close()
          }
        }]
      })
    } else {
      if (count !== 3) {
        const networkP = Popup.show({
          title: 'NO NETWORK',
          content: 'Network is not connected \nPlease check your network?',
          buttons: [{
            label: 'Retry',
            onClick: () => {
              console.log(count)
              this.commit(types.UPDATE_NETERRCOUNT, count++)
              this.dispatch('updateDaySchedule', this.getters.selMonth)
              networkP.close()
            }
          },
          {
            label: 'DISMISS',
            onClick: function () {
              console.log('remind cancel')
              networkP.close()
            }
          }]
        })
      } else {
        count = 0
        const errP = Popup.show({
          title: 'RETRY FAILED',
          content: 'You Have exceeded 3 attempts',
          buttons: [{
            label: 'OK',
            onClick: () => {
              errP.close()
              window.applicationFramework.applicationManager.getOwnerApplication(window.document).back()
            }
          }]
        })
      }
    }
  } finally {
    commit(types.HIDE_LOADING)
  }
}
