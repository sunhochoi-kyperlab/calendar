<template>
  <div class='day layer content'>
    <Nav />
    <Schedule />
  </div>
</template>
<script>
// @ is an alias to /src
import Nav from '@/components/day/Nav.vue'
import Schedule from '@/components/day/Schedule.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'day',
  data () {
    return {
      refresh: Function
    }
  },
  computed: mapGetters(['selDay']),
  components: {
    Nav,
    Schedule
  },
  mounted () {
    this.autoRefresh()
  },
  methods: {
    getDay () {
      this.$store.dispatch('updateDaySchedule', this.selDay)
    },
    autoRefresh () {
      this.refresh = setInterval(this.getDay, 15 * 1000 * 60)
    }
  },
  beforeDestroy () {
    clearInterval(this.refresh)
    // clear
  }
}
</script>
<style lang='scss' scoped>
.day {
}
</style>
