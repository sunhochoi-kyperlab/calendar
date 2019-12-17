import ParserWorker from 'worker-loader!./parser.worker.js' // eslint-disable-line

class Parser {
  constructor () {
    /*
     * schedule 파싱 작업과 reminder 파싱작업은 서로 동시에 실행 되도 무방한 작업.
     * 다라서 하나의 worker를 공유해 사용하지 않고 두개의 worker를 만들어 각각 사용하도록 개발.
     * 하나의 워커를 사용할 경우 http 요청은 동시에 동작하지만, 받은 데이터를 파싱하는 작업은
     * 한 워커의 작업 queue에 schedule, reminder파싱 작업이 모두 쌓이기 떄문에 파싱작업은 동시에 수행되지 않음.
     */
    this.parserWorker = new ParserWorker()
    this.reminderWorker = new ParserWorker()
  }
  /**
   * call parsing worker to parse period events
   * @param {Object} data - raw events from google
   * @param {Object} date - start and end date for parse period
   *   @param {string} date.start - start date. YYYY-MM-DD format
   *   @param {string} date.end - end date. YYYY-MM-DD format
   * @return {Promise} p - result promise
   */
  periodParser (data, date) {
    return new Promise((resolve, reject) => {
      const _msgHandler = (msg) => {
        if (msg.data.type === 'period') {
          resolve(msg.data.result)
          this.parserWorker.removeEventListener('message', _msgHandler)
        }
      }
      this.parserWorker.addEventListener('message', _msgHandler)
      this.parserWorker.postMessage({
        type: 'period',
        data,
        date
      })
    })
  }

  /**
   * call parsing worker to parse daily events
   * @param {Object} data - raw events from google
   * @param {string} date - specific date to parse the events
   * @return {Promise} p - result promise
   */
  dailyParser (data, date) {
    return new Promise((resolve, reject) => {
      const _msgHandler = (msg) => {
        if (msg.data.type === 'daily') {
          resolve(msg.data.result)
          this.parserWorker.removeEventListener('message', _msgHandler)
        }
      }
      this.parserWorker.addEventListener('message', _msgHandler)
      this.parserWorker.postMessage({
        type: 'daily',
        data,
        date
      })
    })
  }

  /**
   * call parsing worker to parse reminder
   * @param {Object} data - raw events from google
   * @return {Promise} p - result promise
   */
  reminderParser (data) {
    return new Promise((resolve, reject) => {
      const _msgHandler = (msg) => {
        if (msg.data.type === 'reminder') {
          resolve(msg.data.result)
          this.reminderWorker.removeEventListener('message', _msgHandler)
        }
      }
      this.reminderWorker.addEventListener('message', _msgHandler)
      this.reminderWorker.postMessage({
        type: 'reminder',
        data
      })
    })
  }
}
export default new Parser()
