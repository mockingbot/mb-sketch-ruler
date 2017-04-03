import { PropTypes } from 'react'

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
