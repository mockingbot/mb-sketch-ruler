// import $ from 'jquery'
import Ruler from './ruler'

import { getPixelRatio } from './utils'

const defaultOptions = {
  ratio: getPixelRatio(),
  startX: -245,
  startY: -45,
  thick: 17,
  perWidth: 10,
  bgColor: '#FFF',
  fgColor: '#E5E5E5',
  shadowColor: 'rgba(0, 0, 0, 0.04)',
  fontColor: 'rgba(39, 54, 78, 0.6)'
}

$.fn.getRuler = function(options = {}) {
  const ops = Object.assign(defaultOptions, options)
  const perWidth = parseFloat(ops.perWidth)
  const thick = ops.thick * ops.ratio
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
