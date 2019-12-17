<template>
  <div class='detail layer content'>
      <div class="detail-summary"><p>{{sch.summary}}</p></div>
    <list :hideDummyItem="true">
        <listItem class="list-item">
            <div class="detail-time">
                <p class="times"><span>Start</span>{{calStart}} {{calStartHour}} {{calStartAmpm}}</p>
                <p class="times"><span>End</span>{{calEnd}} {{calEndHour}} {{calEndAmpm}}</p>
            </div>
        </listItem>
        <listItem class="list-item"><div class="detail-location"><i></i><p style="width: 884px;">{{sch.location}}</p></div>
            <!-- <div class="navi" @click.stop="navi">
                <i v-if="getLocation(sch)"></i>
            </div> -->
            </listItem>
        <listItem class="list-item"><div class="detail-description"><i></i><p>{{sch.description}}</p></div></listItem>
    </list>
  </div>
</template>
<script>
// @ is an alias to /src
import list from 'obigo-js-ui-rnbs/components/list/List'
import listItem from 'obigo-js-ui-rnbs/components/list/list-item'
export default {
  name: 'detail',
  components: {
    list: list,
    listItem: listItem
  },
  data () {
    return {
      sch: this.$route.params
    }
  },
  computed: {
    calStart () {
      return this.sch.start
    },
    calEnd () {
      return this.sch.end
    },
    calStartHour () {
      return this.sch.startHour
    },
    calEndHour () {
      return this.sch.endHour
    },
    calStartAmpm () {
      return this.sch.startAmpm
    },
    calEndAmpm () {
      return this.sch.endAmpm
    }
  },
  methods: {
    getLocation (sch) {
      if (sch.location !== null || '') return true
      else return false
    },
    navi () {
      console.log('navi')
    }
  },
  mounted () {
  }
}
</script>
<style lang='scss' scoped>
.detail {
    .detail-summary {
        position: relative;
        height: 131px;
        border-top:1px solid #656565;
        p {
            padding: 23px 0 0 28px;
            line-height: 40px;
            white-space: normal;
            font-size: 33px;
            color: #fff;
            margin: 0;
        }
    }
    .list-item{
        border-top:1px solid #656565;
        min-height: 130px;
    }
        .detail-time {
            height: 100%;
            .times{
                display: flex;
                height: 64px;
                font-size: 33px;
                color: #fff;
                margin: 0;
                align-items: center;
                &:first-child{border-bottom: 1px solid #31345f;}
                span{
                    font-size: 27px;
                    color: #969696;
                    width: 106px;
                    margin-left: 29px;
                }
            }
        }
        .detail-location {
            display: flex;
            flex-direction: row;
            align-items: center;
            min-height: 130px;
            padding-left: 29px;
            p{
                font-size: 33px;
                color: #fff;
                margin: 0;
            }
        }
    .navi{
        position: absolute;
        right: 0;
        display: block;
        width: 132px;
        height: inherit;
        i {
            position: absolute;
            top: 46px;
            left: 41px;
            display: block;
            width: 60px;
            height: 60px;
            content: '';
            background: url('../../static/img/go-navi.png') no-repeat 0 0;
        }
    }
        .detail-description {
            position: relative;
            min-height: 130px;
            padding: 28px 0 0 137px;
            i {
                background-position: -62px 0;
                position: absolute;
                left: 36px;
                top: 28px;
            }
            p{
               font-size: 26px;
               line-height: 40px;
               color: #969696;
               margin: 0;
            }
        }
    .obg-list {
        top: 0;
        height: 520px;
    }
    i {
        display: block;
        width: 62px;
        height: 66px;
        margin-right: 39px;
        background: url('../../static/img/icon_detail.png') no-repeat 0 0;
    }
}
</style>
