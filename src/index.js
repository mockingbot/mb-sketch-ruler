const { $ } = window
import Ruler from './ruler'

const defaultOptions = {
  ratio: getPixelRatio(),
  startX: -240,
  startY: -100,
  perWidth: 10,
  bgColor: '#F5F5F5',
  fgColor: '#999',
  shadowColor: '#CCC',
  fontColor: '#000'
}

function getPixelRatio () {
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

$.fn.getRuler = function(options = {}) {
  const ops = Object.assign(defaultOptions, options)
  const perWidth = parseFloat(ops.perWidth)
  const thick = (ops.thick || 30) * ops.ratio
  const ops2 = Object.assign({}, ops, {
    // 标尺起始坐标
    originX: ops.startX,
    originY: ops.startY,
    //每一小格的宽度
    perWidth: perWidth,
    scale: perWidth / 10,
    thick: thick,
    width: this.width() * ops.ratio - thick,
    height: this.height() * ops.ratio - thick,
    font: ops.font || `${12 * ops.ratio}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Heiti SC', 'Microsoft Yahei', sans-serif`,
  })
  const ruler = this.data('ruler') ? this.data('ruler') : new Ruler(this, ops2)
  return ruler
}
