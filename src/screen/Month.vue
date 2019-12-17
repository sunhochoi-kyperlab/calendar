<template>
  <div class='month layer content'>
    <Nav />
    <Schedule />
  </div>
</template>
<script>
// @ is an alias to /src
import Nav from '@/components/month/Nav.vue'
import Schedule from '@/components/month/Schedule.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'month',
  data () {
    return {
      refresh: Function
    }
  },
  computed: mapGetters(['selMonth']),
  components: {
    Nav,
    Schedule
  },
  methods: {
    getMonth () {
      this.$store.dispatch('updateMonthSchedule', this.selMonth)
    },
    autoRefresh () {
      this.refresh = setInterval(this.getMonth, 15 * 1000 * 60)
    }
  },
  mounted () {
    console.log('month.vue')
    if (window.applicationFramework) {
      const application = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
      application.addEventListener('ApplicationShown', () => { this.getMonth() })
    }
    this.getMonth()
    this.autoRefresh()
  },
  beforeDestroy () {
    clearInterval(this.refresh)
  }
}
</script>
<style lang='scss' scoped>
.month{
  display:flex;
  flex-direction:column;
}
</style>
