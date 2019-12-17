import {reqSchedule} from '@/utils'
import addWeeks from 'date-fns/add_weeks'
import Parser from '@/libs/parser'
import Schedule from 'node-schedule'
import router from '@/router'
import Popup from 'obigo-js-ui-rnbs/components/popup'
const MAX_REMINDER_WEEK = 8
class Reminder {
  update () {
    const timeMin = new Date()
    const timeMax = addWeeks(timeMin, MAX_REMINDER_WEEK)
    reqSchedule({timeMin, timeMax})
      .then(this._doParse)
      .then(this._delSchedules)
      .then(this._addSchedules)
      .catch((e) => e)
  }
  async _doParse (result) {
    const parsedEvent = await Parser.reminderParser(result.data)
    console.log('parsing schedule', parsedEvent)
    return parsedEvent
  }
  async _addSchedules (schedules) {
    schedules.forEach((schedule) => {
      const scheduleID = schedule.id
      const scheduledJob = schedule.remindTime
      const scheduledTitle = schedule.summary
      const scheduledStart = schedule.start
      // let scheduledEnd = schedule.end
      // let scheduledLocation = schedule.location
      Schedule.scheduleJob(scheduleID, scheduledJob, function () {
        const normalP = Popup.show({
          title: scheduledTitle,
          content: scheduledStart,
          onOpen: () => {
            this.pShow = true
          },
          onClose: () => {
            this.pShow = false
          },
          buttons: [{
            label: 'VIEW',
            onClick: () => {
              router.push({name: 'detail', params: schedule})
              console.log('remind')
              normalP.close()
            }
          },
          {label: 'DISMISS',
            onClick: function () {
              console.log('remind cancel')
              normalP.close()
            }}]
        })
      })
    })
  }
  async _delSchedules (sch) {
    const jobs = Schedule.scheduledJobs
    const schID = Object.keys(jobs)
    schID.forEach((sch) => {
      console.log(Schedule.cancelJob(sch))
    })
    return sch
  }
}
export default new Reminder()
