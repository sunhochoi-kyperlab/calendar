import * as types from './actionTypes'

export default {
  [types.SHOW_LOADING] (state) {
    state.isLoading = true
  },
  [types.HIDE_LOADING] (state) {
    state.isLoading = false
  },
  [types.UPDATE_SEL_MONTH] (state, month) {
    state.selMonth = month
  },
  [types.UPDATE_SEL_WEEK] (state, week) {
    state.selWeek = week
  },
  [types.UPDATE_SEL_DAY] (state, date) {
    state.selDay = date
  },
  [types.UPDATE_IS_LOGIN] (state, isLogin) {
    state.isLogin = isLogin
  },
  [types.UPDATE_MONTH_SCHEDULE] (state, sch) {
    state.monthSchedule = sch
  },
  [types.UPDATE_WEEK_SCHEDULE] (state, sch) {
    state.weekSchedule = sch
  },
  [types.UPDATE_DAY_SCHEDULE] (state, sch) {
    state.daySchedule = sch
  },
  [types.UPDATE_NETERRCOUNT] (state, count) {
    state.netErrCount = count
  }
}
