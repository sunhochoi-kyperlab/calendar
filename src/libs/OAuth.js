import 'obigo-js-oauth-pscsp/oauth'
class OAuth {
  constructor () {
    this.oauth = new window.ObigoOauth()
  }
  open ({successCallback, errorCallback}) {
    const opt = {
      type: 2, // google
      successCallback,
      errorCallback
    }
    this.oauth.open(opt)
  }
  getToken () {
    if (this.oauth.isLoggedin()) {
      return this.oauth.getProperty(this.oauth.property.OAUTH_PROPERTY_ACCESS_TOKEN)
    } else {
      return undefined
    }
  }
  close () {
    this.oauth.close()
  }
  logout () {
    this.oauth.logout()
  }
  isLogin () {
    return this.oauth.isLoggedin()
  }
}
export default new OAuth()
