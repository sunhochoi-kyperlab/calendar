<template>
  <div class='week-nav head-nav layer' >
    <div class="btn-move">
      <a class='prev' @click='prev'><i></i></a>
      <a class='next' @click='next'><i></i></a>
    </div>
    <div class='week' >
      <p @click='now' >{{getTitle()}}</p>
    </div>
    <div class='btn-nav' >
      <a @click='goToDay' ></a><!--WEEK-->
    </div>
    <SignButton />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import format from 'date-fns/format'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import addWeeks from 'date-fns/add_weeks'
import differenceInCalendarWeeks from 'date-fns/difference_in_calendar_weeks'
import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months'
import SignButton from '@/components/SignButton.vue'
export default {
  name: 'Nav',
  computed: mapGetters(['selWeek', 'selDay']),
  components: {
    SignButton
  },
  methods: {
    now () {
      this.$store.dispatch('updateWeekSchedule', new Date())
    },
    goToDay () {
      const today = new Date()
      if (differenceInCalendarWeeks(this.selWeek, today) === 0) {
        this.$store.dispatch('updateSelDay', today)
      } else {
        this.$store.dispatch('updateSelDay', startOfWeek(this.selWeek))
      }
      this.$store.dispatch('updateDaySchedule', this.selDay)
    },
    prev () {
      this.$store.dispatch('updateWeekSchedule', addWeeks(this.selWeek, -1))
    },
    next () {
      this.$store.dispatch('updateWeekSchedule', addWeeks(this.selWeek, 1))
    },
    getTitle () {
      const startDate = startOfWeek(this.selWeek)
      const endDate = endOfWeek(this.selWeek)
      if (differenceInCalendarMonths(startDate, endDate) === 0) {
        return `${format(startDate, 'DD')} - ${format(endDate, 'DD MMM')}`
      }
      return `${format(startDate, 'DD MMM')} - ${format(endDate, 'DD MMM')}`
    }
    // }
  },
  mounted () {
  }
}
</script>
<style lang='scss'>
  @import "../../style/common.scss";
  .week-nav{
    display:flex;
    flex-direction:row;
    .btn-move{
      display: flex;
      flex-direction:row;
      margin: 20px 0 0 20px;
      .prev > i {
        display: block;
        width: 70px;
        height: 70px;
        background: url("../../../static/img/ico_btn.png") no-repeat 0 0;
      }
      .next > i {
        display: block;
        width: 70px;
        height: 70px;
        background: url("../../../static/img/ico_btn.png") no-repeat -70px 0;
      }
      .prev:active {
        & > i {
          background-position: 0 -70px;
        }
      }
      .next:active {
        & > i {
          background-position: -70px -70px;
        }
      }
    }
  .week {
    justify-content:center;
    display:flex;
    p {
      width: 792px;
      text-align:center;
      font-size: 35px;
      color: #ffffff;
      font-family: 'NotoSansCJKkr-Medium'
    }
  }
.btn-nav {
  margin:18px 20px 0 0;
  a {
    display: block;
    width: 70px;
    height: 70px;
    background: url('../../../static/img/ico_btn.png') no-repeat -140px 0;
    &:active {
      background-position: -140px -70px;
    }
  }
}
}
</style>
