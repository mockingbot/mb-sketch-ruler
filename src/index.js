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
  var me = this
  var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me, $.extend(defaultOptions, options))
  return ruler
}
