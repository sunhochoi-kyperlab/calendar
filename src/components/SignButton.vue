<template>
  <div class='sign-button' >
    <a @click='toggleSign' ></a><!-- {{getText(isLogin)}} -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import OAuth from '@/libs/OAuth'
import Popup from 'obigo-js-ui-rnbs/components/popup'
export default {
  name: 'SignButton',
  computed: mapGetters(['isLogin']),
  data () {
    return {
      pShow: true
    }
  },
  methods: {
    toggleSign () {
      if (this.isLogin) {
        const normalP = Popup.show({
          title: 'LOGOUT',
          content: 'Are you sure you want to log out?',
          onOpen: () => {
            this.pShow = true
          },
          onClose: () => {
            this.pShow = false
          },
          buttons: [{
            label: 'OK',
            onClick: () => {
              console.log('logout')
              OAuth.logout()
              this.$store.dispatch('updateIsLogin', false)
              this.$store.dispatch('initData')
              this.$router.push('week')
              normalP.close()
            }
          },
          {label: 'Close',
            isFocus: true,
            onClick: function () {
              console.log('logout cancel')
              normalP.close()
            }}]
        })
      } else {
        this.$router.push('login')
      }
    },
    getText (isLogin) {
      if (isLogin) {
        return 'LOGOUT'
      } else {
        return 'LOGIN'
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang='scss'>
@import '../style/popup.scss';
.sign-button {
  margin:18px 22px 0 0;
  a {
    display: block;
    width: 70px;
    height: 70px;
    background: url('../../static/img/ico_btn.png') no-repeat -210px 0;
    &:active {
      background-position: -210px -70px;
    }
  }
}
</style>
