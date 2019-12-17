<template>
  <div class='month-sch layer'>
    <div class='days layer' >
      <div class='layer day-name' :class='{"is-sun": idx === 0, "is-sat": idx === 6}' v-for='(dn, idx) in dayNames' :key='idx' ><span>{{dn}}</span></div>
    </div>
    <div class='sch-list layer' >
      <div v-for='(week, weekIdx) in updateCal()' :key='weekIdx' class='week'>
        <div v-for='(day, dayIdx) in week' :key='day.key' class='date' :class='{"hasEvent": day.hasEvent, "is-sun": dayIdx === 0, "no-this-mon": !day.isThisMonth, "is-today": day.isToday, "is-sat": dayIdx === 6}' @click='goToDay(day.key)' >
          <span>{{day.date}}</span>
          <div v-if='day.hasEvent' class='evt-marker'></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import addDays from 'date-fns/add_days'
import {getCalendarDate} from '@/utils'
export default {
  name: 'Schedule',
  computed: mapGetters(['selMonth', 'monthSchedule', 'isLogin', 'selDay']),
  data () {
    return {
      dayNames: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    }
  },
  methods: {
    goToDay (date) {
      if (!this.isLogin) {
        console.log('로그인되어있지않음')
      } else {
        this.$store.dispatch('updateSelDay', new Date(date))
        this.$store.dispatch('updateDaySchedule', this.selDay)
      }
    },
    getMonth () {
      return format(this.selMonth, 'MMM YYYY')
    },
    updateCal () {
      let {start, end} = getCalendarDate({year: this.selMonth.getFullYear(), month: this.selMonth.getMonth()})
      const dateArr = []
      const today = new Date()

      let week = []
      while (differenceInCalendarDays(end, start) >= 0) {
        const fm = format(start, 'YYYY-MM-DD')
        week.push({
          date: start.getDate(),
          key: fm,
          hasEvent: (!!this.monthSchedule[fm] && this.monthSchedule[fm].length !== 0),
          isToday: differenceInCalendarDays(start, today) === 0,
          isThisMonth: start.getMonth() === this.selMonth.getMonth()
        })
        if (week.length === 7) {
          dateArr.push(week)
          week = []
        }
        start = addDays(start, 1)
      }
      return dateArr
    }
  },
  updated () {
    console.log('updated month/sch.vue')
  },
  mounted () {
    console.log('mounted month/sch.vue')
  }
}
</script>
<style lang='scss' scoped >
.month-sch{
  flex:1;
  display:flex;
  flex-direction:column;
  .days {
    display:flex;
    flex-direction:row;
    height:50px;
    .layer.day-name {
      width: 155px;
      border-left: 1px solid #646464;;
      border-right: 1px solid #646464;;
    }
    .day-name{
      flex:1;
      display:flex;
      justify-content:center;
      align-items:center;
    }
  }
  .sch-list{
    flex:1;
    display:flex;
    flex-direction:column;
    .week {
      height:94px;
      display:flex;
      flex-direction:row;
      .date{
        color: #acacac;
        flex:1;
        display:flex;
        flex-direction:column;
        &.no-this-mon{
          color:#5a5a5a !important;
        }
        &.is-today{
          background-color: #2c4f80;
        }
      }
    }
  }
  .is-sun {
    color: #ff7b7b !important;
  }
}
</style>
