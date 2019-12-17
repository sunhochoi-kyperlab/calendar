<template>
  <div class='day-sch'>
    <scroll-view ref="scrollView" :scrollbars="true">
      <div class="day-row" v-for="(sch, idx) in daySchedule" :key="idx" @click="goToDetail(sch)">
        <div class="day-info">
          <div class="day-sum">{{sch.summary}}<br>
          {{sch.start}} - {{sch.end}}
          </div>
        </div>
        <div class="day-navi" v-if="getLocation(sch)"></div>
      </div>
      <div v-show="daySchedule.length == 0" class="empty-list">
        Nothing Planned
      </div>
    </scroll-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import list from 'obigo-js-ui-rnbs/components/list/List'
import listItem from 'obigo-js-ui-rnbs/components/list/list-item'
import ScrollView from '@/components/scroll/Scroll'

export default {
  name: 'Schedule',
  components: {
    list: list,
    listItem: listItem,
    'scroll-view': ScrollView
  },
  computed: mapGetters(['daySchedule']),
  activated () {
    this.$refs.scrollView.goToTop()
  },
  data () {
    return {
    }
  },
  methods: {
    getLocation (sch) {
      if (sch.location !== null || '') return true
      else return false
    },
    goToDetail (selSch) {
      console.log('----goToDetail: ', selSch)
      this.$router.push({name: 'detail', params: selSch})
    },
    navi () {
      console.log('asdf')
    }
  },
  updated () {
    this.$refs.scrollView.update()
  }
}
</script>
<style lang='scss' scoped >
.day-sch{
  height: 520px;
  position: relative;
  flex:1;
  display:flex;
  flex-direction: row;
  .day-row {
    height: 150px;
    width: 1154px;
    .day-info {
      width: 1012px;
      height: 100%;
      float: left;
      &:active {
        background-image: url("../../../static/img/li_style3_press.png");
        .day-sum{
          color: white;
        }
      }
      .day-sum {
        font-size: 33.5px;
        color: #646464;
      }
    }
    .day-navi {
      right: 0;
      width: 132px;
      height: inherit;
      position: absolute;
      &:active {
        background: url('../../../static/img/li_style3_press.png') no-repeat 0 0;;
      }
      &:before {
        position: absolute;
        top: 46px;
        left: 41px;
        display: block;
        width: 60px;
        height: 60px;
        content: '';
        background: url('../../../static/img/go-navi.png') no-repeat 0 0;
      }
    }
  }
}
.empty-list{
  font-size: 33.5px;
  color: #646464;
}
</style>
