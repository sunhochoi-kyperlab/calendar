<template>
  <div class='side-menu layer' >
    <a class = 'back' @click='back' ></a>
    <a class = 'home' @click="home"></a>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  methods: {
    back () {
      if (this.$route.name === 'day' || this.$route.name === 'month' || this.$route.name === 'week') {
        window.applicationFramework.applicationManager.getOwnerApplication(window.document).back()
      } else {
        this.$router.back()
      }
    },
    home () {
      window.applicationFramework.applicationManager.getOwnerApplication(window.document).home()
    }
  },
  mounted () {
  }
}
</script>
<style lang='scss'>
.side-menu{
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-between;
  .back {
    width: 100%;
    height: 110px;
    background: url("../../static/img/ico_gnb.png") no-repeat 0 0;
    border: none;
    margin-top: 2px;
    &:active{
      background-position: -126px 1px;
    }
  }
  .home {
    width: 100%;
    height: 110px;
    background: url("../../static/img/ico_gnb.png") no-repeat 1px -100px;
    border: none;
    margin-bottom: 15px;
    &:active {
    background-position: -125px -100px;
  }
  }
}
</style>
