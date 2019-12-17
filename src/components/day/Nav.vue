<template>
  <div class='day-nav head-nav layer' >
    <div class='btn-nav' >
      <a @click='goToMonth' >DAY</a>
    </div>
    <div class='week' >
      <a class="prev" @click='prev' ><i></i></a>
      <p @click='now' >{{getTitle(selDay)}}</p>
      <a class="next" @click='next' ><i></i></a>
    </div>
    <SignButton />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import SignButton from '@/components/SignButton.vue'
export default {
  name: 'Nav',
  computed: mapGetters(['selDay', 'selMonth']),
  components: {
    SignButton
  },
  methods: {
    now () {
      this.$store.dispatch('updateDaySchedule', new Date())
    },
    goToMonth () {
      this.$store.dispatch('updateSelMonth', new Date(this.selDay))
      this.$store.dispatch('updateMonthSchedule', this.selMonth)
    },
    prev () {
      this.$store.dispatch('updateDaySchedule', addDays(this.selDay, -1))
    },
    next () {
      this.$store.dispatch('updateDaySchedule', addDays(this.selDay, 1))
    },
    getTitle (selDay) {
      return `${format(selDay, 'ddd DD MMM')}`
    }
  },
  mounted () {
  }
}
</script>
<style lang='scss' scoped >
  @import "../../style/common.scss";
.day-nav{
  display:flex;
  flex-direction:row;
  .week {
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
</style>
