<template>
  <div class='month-nav head-nav layer' >
    <div class='btn-nav' >
      <a :style="changeViewType" @click='goToWeek'>MONTH</a>
    </div>
    <div class='month' >
      <a class="prev" @click='prev' ><i></i></a>
      <p @click='now' >{{getTitle()}}</p>
      <a class="next" @click.prevent='next'><i></i></a>
    </div>
    <SignButton />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import format from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import differenceInCalendarMonths from 'date-fns/difference_in_calendar_months'
import SignButton from '@/components/SignButton.vue'
export default {
  name: 'Nav',
  computed: {
    changeViewType () {
      let style = {}
      if (!this.isLogin) {
        style = {
          pointerEvents: 'none'
        }
      }
      return style
    },
    ...mapGetters(['selMonth', 'isLogin', 'selWeek'])},
  components: {
    SignButton
  },
  methods: {
    now () {
      this.$store.dispatch('updateMonthSchedule', new Date())
    },
    goToWeek () {
      const today = new Date()
      const diffMonth = differenceInCalendarMonths(today, this.selMonth)
      if (diffMonth === 0) {
        this.$store.dispatch('updateSelWeek', today)
      } else {
        const newMonth = new Date(this.selMonth)
        this.$store.dispatch('updateSelWeek', newMonth.setDate(1))
      }
      this.$store.dispatch('updateWeekSchedule', this.selWeek)
    },
    prev () {
      this.$store.dispatch('updateMonthSchedule', addMonths(this.selMonth, -1))
    },
    next () {
      this.$store.dispatch('updateMonthSchedule', addMonths(this.selMonth, 1))
    },
    getTitle () {
      return format(this.selMonth, 'MMM YYYY')
    }
  },
  mounted () {
  },
  destroyed () {
    console.log('month vue destroy')
  }
}
</script>
<style lang='scss'>
  @import "../../style/common.scss";
.month-nav{
  display:flex;
  flex-direction:row;
  .month {
    justify-content:center;
    flex:1;
    display:flex;
    p {
      width:360px;
      text-align:center;
      font-size: 35px;
      color: #ffffff;
      padding-top: 10px;
    }
   .prev > i {
     margin: 12px auto;
     display: block;
     width: 30px;
     height: 40px;
     background: url("../../../static/img/ico_btn.png") no-repeat 0 0;
   }
   .next > i {
    margin: 12px auto;
    display: block;
    width: 30px;
    height: 40px;
    background: url("../../../static/img/ico_btn.png") no-repeat -30px 0;
  }
    .prev:active {
      box-shadow: 0 0 10px #4092ff, 0 0 10px #4092ff, 0 0 10px #4092ff;
      & > i {
        background-position: 0 -40px;
      }
    }
    .next:active {
      box-shadow: 0 0 10px #4092ff, 0 0 10px #4092ff, 0 0 10px #4092ff;
      & > i {
        background-position: -30px -40px;
      }
    }
  }
  }
</style>
