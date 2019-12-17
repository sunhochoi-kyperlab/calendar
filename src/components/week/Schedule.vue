<template>
  <div class='week-sch'>
    <scroll-view :bounce="false" ref="scrollView" class="scroll" :scrollbars="true">
      <div class='layer' :class='{"is-sun": idx === 0, "is-sat": idx === 6, "is-today": selDay.getDay() === idx}'  v-for='(d, idx) in getWeek()' :key='idx' >
        <div class="days" @click='goToDay(d.key)'>
          <span>{{d.day}}</span>
          <span>{{d.date}}</span>
        </div>
        <div class="summary-area">
          <div v-for='(sch, schIdx) in getSch(d.key)' class='summary' :key='schIdx' @click='goToDetail(sch)' :class='{"noevent": sch.summary == undefined}'>
            <span class="sch-day" v-if="sch.startHour">{{sch.startHour}} {{sch.startAmpm}}</span>
            <span class="sch-text">{{(sch.summary == undefined? "No Event" : sch.summary)}}</span>
          </div>
          <div v-for="(v, idx) in getRestLenOfSch(d.key)" class='summary' :key="idx-4" v-if="v">
              <span>{{v}}</span>
          </div>
        </div>
      </div>
    <!-- <div class='days' >
      <div class='layer day-name' :class='{"is-sun": idx === 0, "is-sat": idx === 6, "is-today": selDay.getDay() === idx}'  v-for='(d, idx) in getWeek()' :key='idx' @click='goToDay(d.key)' >
        <span>{{d.day}}</span>
        <span>{{d.date}}</span>
      </div>
    </div>
    <div class='sch-list layer'>
      <div v-for='(d, weekIdx) in getWeek()' class='week' :class='{"is-sun": weekIdx === 0, "is-sat": weekIdx === 6}' :style='{width: (100 / 7) + "%"}' :key='weekIdx'>
        <div v-for='(sch, schIdx) in getSch(d.key)' class='summary' :key='schIdx' @click='goToDetail(sch)'>
          <div class="isContent"><span>{{sch.summary}}</span><br>{{sch.start}}</div>
        </div>
          <div v-for="(v, idx) in getRestLenOfSch(d.key)" class='summary' :key="idx-4">
              <span>{{v}}</span>
          </div>
      </div>
    </div> -->
    </scroll-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import ScrollView from '@/components/scroll/Scroll'

export default {
  name: 'Schedule',
  computed: mapGetters(['selWeek', 'weekSchedule', 'selDay']),
  components: {
    'scroll-view': ScrollView
  },
  activated () {
    this.$refs.scrollView.goToTop()
  },
  data () {
    return {
      dayNames: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      maxOfSch: 3
    }
  },
  updated () {
    this.$refs.scrollView.update()
  },
  methods: {
    goToDetail (selSch) {
      this.$router.push({name: 'detail', params: selSch})
    },
    goToDay (date) {
      this.$store.dispatch('updateSelDay', new Date(date))
      this.$store.dispatch('updateDaySchedule', this.selDay)
    },
    getWeek () {
      const dateList = []
      const endDate = endOfWeek(this.selWeek)
      let currDate = startOfWeek(this.selWeek)
      while (differenceInCalendarDays(endDate, currDate) >= 0) {
        dateList.push({
          date: format(currDate, 'DD'),
          day: format(currDate, 'ddd').toUpperCase(),
          key: format(currDate, 'YYYY-MM-DD')
        })
        currDate = addDays(currDate, 1)
      }
      return dateList
    },
    getSch (key) {
      return this.weekSchedule[key] || [{}]
    },
    getRestLenOfSch (key) {
      const sch = this.getSch(key)
      const restLen = this.getMaxLenOfSch() - sch.length
      let result = []
      if (restLen > 0) {
        result = Array(restLen).fill('')
      }

      return result
    },
    getMaxLenOfSch () {
      if (this.maxOfSch > 3) {
        return this.maxOfSch
      }
      const wsch = this.weekSchedule
      for (let key in wsch) {
        const sch = wsch[key]

        if (sch.length > this.maxOfSch) {
          this.maxOfSch = sch.length
        }
      }

      return this.maxOfSch
    }
  }
}
</script>
<style lang='scss' scoped >
.week-sch{
    border-top: 1px solid #656565;
  .scroll{
    height: 540px;
    position: relative;
    .layer {
      border-bottom: 1px solid #656565;
      display: flex;
      flex-direction: row;
      .days{
        display:flex;
        font-size: 35px;
        line-height: 37px;
        width: 160px;
        min-height:130px;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        background-color: #222222;
        span{
          display: block;
          font-family: 'NotoSansCJKkr-Medium';
          color: #fff;
          &:last-child{
              margin-top: 15px;
          }
        }
      }
      .summary-area{
        display: flex;
        flex-direction: column;
        color:#fff;
        .summary{
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 994px;
            height: 65px;
            border-bottom: 1px solid #31345f;
            .sch-day{
                padding-left: 72px;
                font-size: 27px;
                color: #969696;
                margin-right: 65px;
            }
            .sch-text{
                font-size: 33px;
                color: #fff;
            }
            &:last-child{
                border-bottom: none;
            }
            &:active, &.active{
                background-color: #3a3d60;
            }
            &.noevent{
                height: 100%;
                padding-left: 34px;
            }
        }
      }
      &.is-sun .days span, &.is-sat .days span{
        color: #ff0000;
      }
      &.is-today .days span:last-child{
        width: 62px;
        height: 62px;
        padding-top:11px;
        background: #696449;
        border-radius: 100%;
        text-align: center;
        margin-top:5px;
      }
    }
    .day-name{
      flex:1;
      & .is-sun,  & .is-sat{
        color: #ff7b7b !important;
      }
    }
  }
}
</style>
