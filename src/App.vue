<template>
  <div id="app">
    <div class='sidebar layer' >
      <SideMenu />
    </div>
    <router-view/>
  </div>
</template>
<script>
import SideMenu from '@/components/SideMenu.vue'
export default {
  components: {
    SideMenu
  }
}
</script>
<style lang="scss">
  @import './style/reset.scss';
  @import './style/common.scss';
</style>
<style lang="scss">
  #app {
    font-family: 'NotoSansCJKkr-Regular';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display:flex;
    flex-direction:row;
    width:1280px;
    height:650px;
    background: #0b0d1f url("../static/img/gnb_bg.png") no-repeat 0 0;
    .sidebar {
      width:126px;
      height:100%;
    }
  }
</style>
