import PropTypes from 'prop-types'

export const RULER_THROTTLE = 17

export const contextTypes = {
  thick: PropTypes.number,
  perWidth: PropTypes.number,
  ratio: PropTypes.number,
  scale: PropTypes.number,
  fontScale: PropTypes.number,
  font: PropTypes.string,
  fontColor: PropTypes.string,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  shadowColor: PropTypes.string,
  onLineChange: PropTypes.func
}

export function getPixelRatio () {
  var context = document.createElement('canvas').getContext('2d')

  var backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1
  // console.log("当前设备像素倍数: ", window.devicePixelRatio)
  return (window.devicePixelRatio || 1) / backingStore
}

export const throttle = (fn, wait = 17) => {
  let last, timer
  return (...args) => {
    const now = +new Date()
    const next = last + wait
    if (last && (now < next)) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = +new Date()
        fn(...args)
      }, next - now)
    } else {
      last = now
      fn(...args)
    }
  }
}

// export const dedounce = () => {}
