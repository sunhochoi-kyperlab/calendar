import OAuth from '@/libs/OAuth'
const now = new Date()
const state = {
  isLoading: false,
  today: new Date(now),
  selMonth: new Date(now),
  selWeek: new Date(now),
  selDay: new Date(now),
  isLogin: OAuth.isLogin(),
  monthSchedule: {},
  weekSchedule: {},
  daySchedule: []
}
export default state
