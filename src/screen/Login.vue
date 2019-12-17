<template>
  <div class='login layer content'>
    <p class="info-text">Manage your schedule easily by</p>
      <a class="sign-btn" @click='login'><i></i>Sign in with Google</a>
    <p class="sub-text">To sign up, use mobile or PC </p>
  </div>
</template>
<script>
// @ is an alias to /src
import OAuth from '@/libs/OAuth'
import {mapGetters} from 'vuex'
export default {
  name: 'login',
  computed: mapGetters(['isLogin']),
  methods: {
    login () {
      OAuth.open({
        successCallback: this.successCallback,
        errorCallback: this.errorCallback
      })
    },
    successCallback () {
      console.log('oauth success')
      this.$store.dispatch('updateIsLogin', true)
      this.$router.push({name: 'week'})
      if (this.$route.name === 'day') {
        this.$store.dispatch('updateDaySchedule', new Date())
      } else if (this.$route.name === 'week') {
        this.$store.dispatch('updateWeekSchedule', new Date())
      } else if (this.$route.name === 'month') {
        this.$store.dispatch('updateMonthSchedule', new Date())
      }
    },
    errorCallback () {
      console.log('oauth error')
      this.$store.dispatch('updateIsLogin', false)
    }
  },
  mounted () {
    this.successCallback = this.successCallback.bind(this)
    this.errorCallback = this.errorCallback.bind(this)
  }
}
</script>
<style lang='scss' scoped>
.login{
  margin-top: 139px;
  margin-left: 95px;
  width: 620px;
  height: 300px;
  .info-text {
    margin-top: 36px;
    font-size: 35px;
    color: #ffffff;
    & strong {
      font-family: 'NotoSansCJKkr-Regular';
      font-size: 35px;
      line-height: 150%;
    }
  }
  .sub-text{
    font-size: 28px;
    color: #ffffff;
  }
  .sign-btn {
    position: relative;
    margin-top: 28px;
    display: block;
    box-sizing: border-box;
    padding-left: 109px;
    width: 619px;
    height: 90px;
    background-color: #3c3d4c;
    border-radius: 5px;
    font-size: 35px;
    color: #fff;
    text-align: left;
    line-height: 83px;
    &:active {
      background-color: #00b1fb;
    }
    a {
      background: none;
      border: 0px;
    }
    &:before {
      content: url("../../static/img/logo_google.png");
      position: absolute;
      top: 9px;
      left: 39px;
      height: 55px;
    }
  }
}
</style>
