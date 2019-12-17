import endOfMonth from 'date-fns/end_of_month'
import addDays from 'date-fns/add_days'
import format from 'date-fns/format'
import axios from 'axios'
import OAuth from '@/libs/OAuth'

/**
 * monthly 일정 표를 그리기 위해 선택된 달의 시작과 끝을 계산
 * @param {Object} opt - options
 * @param {number} opt.year - year
 * @param {number} opt.month - month
 * @return {Object} opt - date set
 * @return {Object} opt.start - calendar start date
 * @return {Object} opt.end - calendar end date
 */
export const getCalendarDate = ({year, month}) => {
  let start = new Date(year, month, 1, 0, 0, 0)
  let end = endOfMonth(new Date(year, month, 1, 23, 59, 59))
  start = addDays(start, -start.getDay())
  end = addDays(end, 6 - end.getDay())

  return {start, end}
}

/**
 * 일정 요청을 위한 ajax 호출
 * @param {Object} opt - options
 * @param {number} opt.timeMin - 가져올 일정의 시작 타임
 * @param {number} opt.timeMax - 가져올 일정의 끝 타임
 * @return {promise} - result
 */
export const reqSchedule = ({timeMin, timeMax}) => {
  return axios({
    method: 'get',
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    timeout: 10000,
    headers: {
      authorization: `Bearer ${OAuth.getToken()}`
    },
    params: {
      singleEvents: true,
      timeMin: format(timeMin, 'YYYY-MM-DDT00:00:00Z'),
      timeMax: format(timeMax, 'YYYY-MM-DDT23:59:59Z')
    }
  })
}
