<template>
  <div class='week layer content'>
    <Nav />
    <Schedule/>
  </div>
</template>
<script>
// @ is an alias to /src
import Nav from '@/components/week/Nav.vue'
import Schedule from '@/components/week/Schedule.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'week',
  data () {
    return {
      refresh: Function
    }
  },
  computed: mapGetters(['selWeek']),
  components: {
    Nav,
    Schedule
  },
  methods: {
    getWeek () {
      this.$store.dispatch('updateWeekSchedule', this.selWeek)
    },
    autoRefresh () {
      this.refresh = setInterval(this.getWeek, 15 * 1000 * 60)
    }
  },
  mounted () {
    this.autoRefresh()
  },
  beforeDestroy () {
    clearInterval(this.refresh)
  }
}
</script>
<style lang='scss' scoped>
.week{
}
</style>
