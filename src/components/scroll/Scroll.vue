<template>
  <div class="scroll-view">
    <div class="scroll-container">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import {ScrollHandler} from './ScrollHandler'

/**
   * scroll-view component
   *
   * 주의) scollbars = true로 사용하지 않을 경우, <keep-alive> 상태에서 scroll refresh 했을 경우
   * 스크롤이 freeze 되는 현상이 있음.
   */
export default {
  name: 'scroll-view',
  props: {
    snap: {
      type: String | Boolean,
      default: false
    },
    scrollbars: {
      type: Boolean | String,
      default: false
    },
    bounce: {
      type: Boolean,
      default: true
    },
    /**
       * 빠르게 flicking 했을 때 스크롤 설정.
       * 페이지가 계속 스크롤되는 것을 막으려면 false
       */
    momentum: {
      type: Boolean,
      default: true
    },
    keepScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$scroll = ScrollHandler.attachTo(this.$el, {
      snap: this.snap,
      scrollbars: this.scrollbars,
      bounce: this.bounce,
      momentum: this.momentum
    })
  },
  updated () {
    if (this.$scroll && !this.keepScroll) {
      // 페이지 상단으로 이동.
      this.$scroll.goToTop()
    }
  },
  activated () {
    // dom이 display: none 등으로 인해 비활성화 되었을 경우,
    // scroll이 refresh 되지 않는 현상이 있음. 이를 fix하기 위한 코드
    if (this.$scroll) {
      this.update()
    }
  },
  beforeDestroy () {
    if (this.$scroll) {
      this.$scroll.destroy()
      this.$scroll = undefined
    }
  },
  methods: {
    update () {
      if (this.$scroll) {
        this.$scroll.update()
      }
    },
    goToTop () {
      if (this.$scroll) {
        this.$scroll.goToTop()
      }
    }
  }
}
</script>
<style lang="scss">
  .scroll-view {
    overflow: hidden;
  }
</style>
