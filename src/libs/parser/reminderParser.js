import format from 'date-fns/format'
import addMinutes from 'date-fns/add_minutes'
import differenceInMinutes from 'date-fns/difference_in_minutes'
class ReminderParser {
  constructor () {
    this.reminders = []
    this.today = null
  }

  _calcRemindTime (evt, reminder) {
    const {id, location, summary, start, end} = evt
    for (let i = 0; i < reminder.length; i++) {
      if (reminder[i].method === 'popup') {
        const startTime = new Date(start.date || start.dateTime)
        if (start.date) {
          startTime.setHours(0)
          startTime.setMinutes(0)
          startTime.setSeconds(0)
        }
        const remindTime = addMinutes(startTime, -reminder[i].minutes)
        const diff = differenceInMinutes(this.today, remindTime)
        if (diff <= 0) {
          this.reminders.push({
            id,
            summary,
            location,
            start: start.date || start.dateTime, // string type
            end: end.date || end.dateTime, // string type
            remindTime: remindTime // Date type
          })
        }
      }
    }
  }

  /**
   * parse reminder from google calendar event data from google api
   * @param {object} evts - event object from ccss
   * @return {array} reminders - parsed events
   */
  parse (evts) {
    this.reminders = []
    this.today = new Date()
    const {defaultReminders, items} = evts
    const len = items.length
    for (let i = 0; i < len; i++) {
      const item = items[i]
      if (item.reminders.useDefault === true) {
        this._calcRemindTime(item, defaultReminders)
      } else if (item.reminders.useDefault === false && item.reminders.overrides !== undefined) {
        this._calcRemindTime(item, item.reminders.overrides)
      }
    }
    this.reminders.sort((a, b) => {
      if (a.remindTime < b.remindTime) {
        return -1
      } else {
        return 1
      }
    })
    return this.reminders
  }
}
export default new ReminderParser()
