import addDays from 'date-fns/add_days'
import isWithinRange from 'date-fns/is_within_range'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import format from 'date-fns/format'
class DailyParser {
  constructor () {
    this.current = null
    this.allDayEventCount = 0
  }
  _validEvent (evt) {
    const start = new Date((evt.start.dateTime && evt.start.dateTime) || evt.start.date)
    const end = new Date((evt.end.dateTime && evt.end.dateTime) || addDays(new Date(evt.end.date), -1)) // allday event일경우 end date에서 1을 빼서 계산.
    start.setHours(0)
    start.setMinutes(0)
    end.setHours(23)
    end.setMinutes(59)
    return isWithinRange(this.current, start, end)
  }
  _compareDate (a, b) {
    return Math.abs(differenceInCalendarDays(a, b))
  }
  _getCurrentDateEvent (item) {
    const start = new Date(item.start.dateTime)
    const end = new Date(item.end.dateTime)
    let eventDate = new Date(this.current)
    const dateDiff = this._compareDate(start, end)
    let newStartDate
    let newEndDate
    if (dateDiff !== 0) { // multi day event
      const diffSelDate = Math.abs(this._compareDate(eventDate, start) - dateDiff)
      let isAllDay = false
      if (diffSelDate === 0) { // last day
        newStartDate = new Date(eventDate)
        newStartDate.setHours(0)
        newStartDate.setMinutes(0)

        newEndDate = new Date(eventDate)
        newEndDate.setHours(end.getHours())
        newEndDate.setMinutes(end.getMinutes())
      } else if (diffSelDate === dateDiff) { // first day
        newStartDate = new Date(eventDate)
        newStartDate.setHours(start.getHours())
        newStartDate.setMinutes(start.getMinutes())

        newEndDate = new Date(eventDate)
        newEndDate.setHours(23)
        newEndDate.setMinutes(59)
      } else { // all day event
        isAllDay = true
        newStartDate = eventDate
        newEndDate = eventDate
      }
      return {
        isAllDay: isAllDay,
        start: format(newStartDate, 'YYYY-MM-DD HH:mm'),
        end: format(newEndDate, 'YYYY-MM-DD HH:mm'),
        id: item.id,
        summary: item.summary || '(제목 없음)',
        description: item.description,
        location: item.location || null
      }
    } else {
      newStartDate = new Date(eventDate)
      newStartDate.setHours(start.getHours())
      newStartDate.setMinutes(start.getMinutes())

      newEndDate = new Date(eventDate)
      newEndDate.setHours(end.getHours())
      newEndDate.setMinutes(end.getMinutes())
      return {
        isAllDay: false,
        start: format(newStartDate, 'YYYY-MM-DD HH:mm'),
        end: format(newEndDate, 'YYYY-MM-DD HH:mm'),
        id: item.id,
        summary: item.summary || '(제목 없음)',
        description: item.description,
        location: item.location || null
      }
    }
  }
  _getEvent (item) {
    if (!this._validEvent(item)) {
      return null
    }
    if (item.start.date) { // all day
      return {
        isAllDay: true,
        start: format(this.current, 'YYYY-MM-DD HH:mm'),
        end: format(this.current, 'YYYY-MM-DD HH:mm'),
        id: item.id,
        summary: item.summary || '(제목 없음)',
        location: item.location || null
      }
    } else {
      return this._getCurrentDateEvent(item)
    }
  }
  _insertEvent (events, evt) {
    if (evt.isAllDay) {
      events.splice(0, 0, evt)
      this.allDayEventCount++
    } else if (this.allDayEventCount === events.length) {
      events.push(evt)
    } else {
      let start = this.allDayEventCount
      let end = events.length - 1
      let mid = Math.floor((start + end) / 2)
      let midDate
      const evtDate = new Date(evt.start)
      while (start < end) {
        midDate = new Date(events[mid].start)
        if (midDate > evtDate) {
          end = mid - 1
        } else if (midDate < evtDate) {
          start = mid + 1
        } else {
          break
        }
        mid = Math.floor((start + end) / 2)
      }
      if (mid < 0) {
        mid = 0
      }
      midDate = new Date(events[mid].start)
      if (midDate < evtDate) {
        events.splice(mid + 1, 0, evt)
      } else {
        events.splice(mid, 0, evt)
      }
    }
  }
  /**
   * parse daily events from google calendar event data from ccss
   * @param {object} evts - event object from ccss
   * @param {string} date - parse date. YYYY-MM-DD format
   * @retur {Array} events - parsed events
   */
  parse (evts, date) {
    this.current = new Date(date)
    this.current.setHours(0)
    this.current.setMinutes(0)
    this.allDayEventCount = 0
    const items = evts.items
    const len = items.length

    const events = []
    for (let i = 0; i < len; i++) {
      const evtResult = this._getEvent(items[i])
      // evtResult && events.push(evtResult)
      evtResult && this._insertEvent(events, evtResult)
    }
    return events
  }
}
export default new DailyParser()
