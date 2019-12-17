import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ObigoUI from 'obigo-js-ui-rnbs'

Vue.use(ObigoUI)
Vue.config.productionTip = false

/* Native Title */
let app
if (window.applicationFramework && window.applicationFramework.applicationManager) {
  app = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
}

if (app) {
  app.addEventListener('ApplicationShown', function () {
    let a = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
    let d = a.getDescriptor()
    if (a && d) {
      if (d.localURI && d.iconSrcPath) {
        a.setStatusBarTitle(d.getWidgetName('en-us'), (d.localURI + d.iconSrcPath))
      }
    }
  })
}
/* Native Title - End */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
router.push('week')
