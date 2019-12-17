import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
class PeriodParser {
  constructor () {
    this.startDate = null
    this.endDate = null
    this.events = {}
    this.allDayEventCount = {}
  }
  _compareDate (a, b) {
    return differenceInCalendarDays(a, b)
  }
  _isAllDayEvent (evt) {
    return evt.start.date !== undefined
  }
  _getEndDate (val) {
    if (val.dateTime) {
      return new Date(val.dateTime)
    } else if (val.date) {
      const d = addDays(new Date(val.date), -1) // allday event일경우 end date에서 1을 빼서 계산.
      d.setHours(0)
      d.setMinutes(0)
      return d
    }
  }
  _getStartDate (val) {
    if (val.dateTime) {
      return new Date(val.dateTime)
    } else if (val.date) {
      const d = new Date(val.date)
      d.setHours(0)
      d.setMinutes(0)
      return d
    }
  }
  _getEvent (evt) {
    const evtStartDate = this._getStartDate(evt.start)
    const evtEndDate = this._getEndDate(evt.end)

    if (this._compareDate(this.endDate, evtStartDate) < 0 || this._compareDate(evtEndDate, this.startDate) < 0) {
      return
    }

    let boundaryStart = differenceInCalendarDays(evtStartDate, this.startDate) > 0 ? new Date(evtStartDate) : new Date(this.startDate)
    const boundaryEnd = differenceInCalendarDays(evtEndDate, this.endDate) > 0 ? new Date(this.endDate) : new Date(evtEndDate)
    const diff = Math.abs(this._compareDate(boundaryStart, boundaryEnd))
    // start date
    const startFormatTimes = format(evtStartDate, 'HH:mm')
    let startSplitTimes = startFormatTimes.split(":")
    let startHour12= parseInt(startSplitTimes[0])%12
    let startHour= String(startHour12)
    let startTimes= null
    let startAmpm= ""
    startHour.length == 2 ? startTimes= `${startHour}:${startSplitTimes[1]}` : startHour == 0?  startTimes= `12:${startSplitTimes[1]}` : startTimes= `0${startHour}:${startSplitTimes[1]}`
    startSplitTimes[0] > 12? startAmpm = "PM" : startAmpm = "AM"

    // end date
    const endFormatTimes = format(evtEndDate, 'HH:mm')
    let endSplitTimes = endFormatTimes.split(":")
    let endHour12= parseInt(endSplitTimes[0])%12
    let endHour= String(endHour12)
    let endTimes= null
    let endAmpm= ""
    endHour.length == 2 ? endTimes= `${endHour}:${endSplitTimes[1]}` : endHour == 0?  endTimes= `12:${endSplitTimes[1]}` : endTimes= `0${endHour}:${endSplitTimes[1]}`
    endSplitTimes[0] > 12? endAmpm = "PM" : endAmpm = "AM"
        
    if (diff === 0) {
      this._insert({
        isAllDay: this._isAllDayEvent(evt),
        // start: format(evtStartDate, 'YYYY-MM-DD HH:mm'),
        start: format(evtStartDate, 'YYYY-MM-DD'),
        startHour: startTimes,
        startAmpm: startAmpm,
        // end: format(evtEndDate, 'YYYY-MM-DD HH:mm'),
        end: format(evtEndDate, 'YYYY-MM-DD'),
        endHour: endTimes,
        endAmpm: endAmpm,
        id: evt.id,
        summary: evt.summary || 'No Event',
        location: evt.location || null
      }, format(boundaryStart, 'YYYY-MM-DD'))
    } else {
      let count = 0
      while (count <= diff) {
        let isAllDay = this._isAllDayEvent(evt)
        let newStartDate
        let newEndDate
        if (count === 0) { // first day
          newStartDate = new Date(boundaryStart)
          newStartDate.setHours(evtStartDate.getHours())
          newStartDate.setMinutes(evtStartDate.getMinutes())

          newEndDate = new Date(boundaryStart)
          newEndDate.setHours(23)
          newEndDate.setMinutes(59)
        } else if (count === diff) { // last day
          newStartDate = new Date(boundaryStart)
          newStartDate.setHours(0)
          newStartDate.setMinutes(0)

          newEndDate = new Date(boundaryStart)
          newEndDate.setHours(evtEndDate.getHours())
          newEndDate.setMinutes(evtEndDate.getMinutes())
        } else {
          newStartDate = new Date(boundaryStart)
          newEndDate = new Date(boundaryStart)
          isAllDay = true
        }
        this._insert({
          isAllDay,
          start: format(newStartDate, 'YYYY-MM-DD HH:mm'),
          end: format(newEndDate, 'YYYY-MM-DD HH:mm'),
          id: evt.id,
          summary: evt.summary || '(제목 없음)',
          location: evt.location || null
        }, format(boundaryStart, 'YYYY-MM-DD'))

        count++
        boundaryStart = addDays(boundaryStart, 1)
      }
    }
  }
  _insert (evt, key) {
    if (!this.events[key]) {
      this.events[key] = []
      this.allDayEventCount[key] = 0
    }
    const events = this.events[key]

    if (evt.isAllDay) {
      events.splice(0, 0, evt)
      this.allDayEventCount[key]++
    } else if (this.allDayEventCount[key] === events.length) {
      events.push(evt)
    } else {
      let start = this.allDayEventCount[key]
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
   * parse period events from google calendar event data from ccss
   * @param {object} evts - event object from ccss
   * @param {object} opt - date period to parse
   *   @param {string} opt.start - start date. YYYY-MM-DD foramt
   *   @param {string} opt.end - end date. YYYY-MM-DD foramt
   * @return {object} events - parsed events
   */
  parse (evts, {start, end}) {
    this.events = {}
    this.allDayEventCount = {}
    this.startDate = new Date(start)
    this.startDate.setHours(0)
    this.startDate.setMinutes(0)

    this.endDate = new Date(end)
    this.endDate.setHours(23)
    this.endDate.setMinutes(59)
    const items = evts.items
    const len = items.length
    for (let i = 0; i < len; i++) {
      this._getEvent(items[i])
    }
    return this.events
  }
}
export default new PeriodParser()
