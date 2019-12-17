import DailyParser from './dailyParser'
import PeriodParser from './periodParser'
import ReminderParser from './reminderParser'

self.addEventListener('message', (evt) => {
  const {type, date, data} = evt.data
  let result = null
  if (type === 'daily') {
    result = DailyParser.parse(data, date)
  } else if (type === 'period') {
    result = PeriodParser.parse(data, date)
  } else if (type === 'reminder') {
    result = ReminderParser.parse(data)
  }
  self.postMessage({result, type})
})
