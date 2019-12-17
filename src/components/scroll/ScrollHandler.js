/* @flow */
import IScroll from 'iscroll'

export type ScrollOptions = {
  probeType: number,
  bounce: boolean,
  mouseWheel: boolean,
  scrollbars: boolean,
  fadeScrollbars: boolean,
  interactiveScrollbars: boolean,
  click: boolean,
  disableMouse: boolean,
  disableTouch: boolean,
  disablePointer: boolean
}

opaque type HTMLElement = HTMLElement

export class ScrollHandler {
  $scroll: IScroll
  $options: ScrollOptions

  constructor (options: ScrollOptions) {
    this.$scroll = null
    this.$options = Object.assign({
      probeType: 2,
      snap: false,
      bounce: true,
      mouseWheel: true,
      scrollbars: false,
      fadeScrollbars: true,
      interactiveScrollbars: false,
      momentum: true, // 빠르게 flicking 했을 때 페이지가 계속 스크롤되는 것을 막으려면 false
      click: true, // false 일 경우 flicking시 click 이벤트도 같이 일어남.
      disableMouse: false,
      disableTouch: false,
      disablePointer: true,
      preventDefaultException: {
        // default config, all form elements,
        // extended with a WebComponents Custom Element from the future
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|X-WIDGET)$/,
        // and allow any element that has an accessKey (because we can)
        accessKey: /.+/
      }
    }, options)
  }

  /**
   * 옵션 정의
   * @param {string|Object} keyOrOptions
   * @param {any} value
   */
  setOption (keyOrOptions: string | Object, value: any): ScrollHandler {
    if (typeof keyOrOptions === 'object') {
      Object.assign(this.$options, keyOrOptions)
    } else if (typeof keyOrOptions === 'string') {
      this.$options[keyOrOptions] = value
    }

    return this
  }

  /**
   * 특정 옵션 반환
   * @param {string} key
   */
  getOption (key: string): any {
    return this.$options[key]
  }

  /**
   * IScroll 인스턴스 생성 후 엘리먼트에 부착
   * @param {string|HTML*Element} $el
   */
  attachTo ($el: string | HTMLElement): ScrollHandler {
    this.$scroll = new IScroll($el, this.$options)
    return this
  }

  /**
   * scroll update
   */
  update () {
    if (this.$scroll) {
      // 참고: https://github.com/cubiq/iscroll#mastering-the-refresh-method
      setTimeout(() => {
        this.$scroll.refresh()
      }, 0)
    }
  }

  /**
   * scroll destroy
   */
  destroy () {
    if (this.$scroll) {
      this.$scroll.destroy()
    }
  }

  /**
   * 페이지 상단으로 이동
   */
  goToTop () {
    if (this.$scroll) {
      this.$scroll.scrollTo(0, 0)
    }
  }

  /**
   * 새로운 IScroll 인스턴스를 생성하여 엘리먼트에 부착
   * @param {string|HTML*Element} $el
   * @param {object} options
   * @static
   */
  static attachTo ($el: string | HTMLElement, options: ScrollOptions): ScrollHandler {
    const instance = new ScrollHandler(options)
    return instance.attachTo($el)
  }
}

export default ScrollHandler
