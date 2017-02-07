/**
 * 2016.6.11 iny
 * jquery插件v0.2 直接append canvas
 */
const { $ } = window
import RulerFactory from './RulerFactory'
import './ruler.sass'

export default class Ruler {
  constructor (elem, options) {
    this.elem = elem
    this._init(options)
  }

  _init (options = {}) {
    // 参数默认处理
    Object.assign(this, options)

    //如果已经初始化,则需要先销毁原有实例
    this.factory = new RulerFactory({
      ratio : this.ratio,
      thick : this.thick / this.ratio,
      width : this.width / this.ratio,
      height : this.height / this.ratio,
      fgColor : this.fgColor,
      bgColor : this.bgColor,
      font : this.font
    })

    //添加标尺的dom节点
    this._addRuler()

    //需要根据当前已经滚动的距离绘制标尺,而不是傻傻地每次都从头开始
    this.startX = this.originX + this.elem.scrollLeft()
    this.startY = this.originY + this.elem.scrollTop()
    this._drawRuler()

    //对齐线信息
    this.horLineValue = options.horLineValue || []
    this.verLineValue = options.verLineValue || []
    this.horLine = []
    this.verLine = []
    this._addAlignLine()

    this.elem.data('ruler', this)
  }
  _addRuler () {
    var elem = this.elem
    var factory = this.factory
    var rulerBox = $('<div class="mb-ruler"></div>')
    this.rulerBox = rulerBox

    //左上角小块
    var corner = factory.getCorner()
    rulerBox.prepend(corner)

    //创建水平标尺
    var horRuler = factory.getHorRuler()
    rulerBox.prepend(horRuler)
    this.horCtx = horRuler.get(0).getContext('2d')

    //水平对齐线container
    var horDiv = $('<div class="hor-div"></div>')
    horDiv.css('marginLeft', this.thick / this.ratio)
    rulerBox.prepend(horDiv)
    this.horDiv = horDiv

    //竖直对齐线container
    var verDiv = $('<div class="ver-div"></div>')
    verDiv.css('marginTop', this.thick / this.ratio)
    rulerBox.prepend(verDiv)
    this.verDiv = verDiv

    //点击标尺绘制对齐线
    horRuler.on('click', function(event) {
      event.preventDefault()
      var value = this.horCurrentValue
      this.horLineValue.push(value)
      this._addHorLine(value)
      $(document.body).trigger('setAlignLine', {
        horValue : this.horLineValue,
        verValue : this.verLineValue
      })

    }.bind(this))

    //创建垂直标尺
    var verRuler = factory.getVerRuler()
    rulerBox.prepend(verRuler)
    elem.prepend(rulerBox)
    this.verCtx = verRuler.get(0).getContext('2d')

    //点击标尺绘制对齐线
    verRuler.on('click', function(event) {
      event.preventDefault()
      var value = this.verCurrentValue
      this.verLineValue.push(value)
      this._addVerLine(value)
      $(document.body).trigger('setAlignLine', {
        horValue : this.horLineValue,
        verValue : this.verLineValue
      })
    }.bind(this))

    this.horRuler = horRuler
    this.verRuler = verRuler
    this.corner = corner

    this._addCurrentValue()
  }
  _addCurrentValue () {
    this._addHorCurrentValue()
    this._addVerCurrentValue()
  }
  _addHorCurrentValue () {
    var factory = this.factory
    var horCur = factory.getHorCur()
    var horSpan = horCur.find('p')
    var horRuler = this.horRuler

    this.horDiv.prepend(horCur)

    //当鼠标进入标尺时,显示刻度,禁止对齐线的鼠标事件
    horRuler.on('mouseenter', function(event) {
      event.preventDefault()
      this.horDiv.css('pointerEvents', 'none')
      horCur.css({
        display: 'block'
      })

    }.bind(this))

    //当鼠标在标尺上移动时,改变鼠标指向的刻度
    horRuler.on('mousemove', function(event) {
      event.preventDefault()
      var value = this.startX + event.offsetX
      var scale = this.scale
      value = value / scale >> 0
      if(value != this.horCurrentValue){
        this.horCurrentValue = value
        horCur.css({
          marginLeft: event.offsetX
        })
        horSpan.html(value)
      }
    }.bind(this))

    //当鼠标离开标尺时,隐藏刻度,恢复对齐线的鼠标事件
    horRuler.on('mouseout', function(event) {
      event.preventDefault()
      this.horDiv.css('pointerEvents', 'auto')
      horCur.css({
        display: 'none'
      })
    }.bind(this))
  }
  _addVerCurrentValue () {
    var factory = this.factory
    var verCur = factory.getVerCur()
    var verSpan = verCur.find('p')
    var verRuler = this.verRuler

    this.verDiv.prepend(verCur)

    //当鼠标进入标尺时,显示刻度,禁止对齐线的鼠标事件
    verRuler.on('mouseenter', function(event) {
      event.preventDefault()
      this.verDiv.css('pointerEvents', 'none')
      verCur.css({
        display: 'block'
      })

    }.bind(this))
    //当鼠标在标尺上移动时,改变鼠标指向的刻度
    verRuler.on('mousemove', function(event) {
      event.preventDefault()

      var value = this.startY + event.offsetY
      var scale = this.scale
      value = value / scale >> 0
      if(value != this.verCurrentValue){
        this.verCurrentValue = value
        verCur.css({
          marginTop: event.offsetY
        })
        verSpan.html(value)
      }
    }.bind(this))

    //当鼠标离开标尺时,隐藏刻度,恢复对齐线的鼠标事件
    verRuler.on('mouseout', function(event) {
      event.preventDefault()
      this.verDiv.css('pointerEvents', 'auto')
      verCur.css({
        display: 'none'
      })
    }.bind(this))
  }
  _drawAlignLine () {
    this._drawHorLine()
    this._drawVerLine()
  }
  _addAlignLine () {
    $.each(this.horLineValue, function(index, value){
      this._addHorLine(value)
    }.bind(this))

    $.each(this.verLineValue, function(index, value){
      this._addVerLine(value)
    }.bind(this))
  }
  //新增一条对齐线
  _addHorLine (value) {
    var horLine = this.factory.getHorLine()
    var offsetX = value * this.scale - this.startX
    horLine.css('marginLeft', offsetX)
    horLine.find('p').html(value)
    this.horDiv.append(horLine)

    this.horLine.push(horLine)
    //点击删除图标移除该对齐线
    horLine.find('span').one('click', function(){
      // 事件解绑
      horLine.off('mouseenter')
      horLine.off('mouseleave')
      // horLine.off('mousedown')
      // 删除元素
      var index = this.horLine.indexOf(horLine)
      this.horLine.splice(index, 1)
      this.horLineValue.splice(index, 1)
      //移除dom
      horLine.remove()
      //通知事件
      $(document.body).trigger('setAlignLine', {
        horValue : this.horLineValue,
        verValue : this.verLineValue
      })
    }.bind(this))

    //增加拖动事件
    horLine.on('mousedown', function(e) {
      e.preventDefault()
      var startX = e.clientX

      $(document).on('mousemove', function(event) {
        event.preventDefault()
        var deltaX = event.clientX - startX
        startX = event.clientX

        //改变对齐线的位置
        var marginLeft = parseInt(horLine.css('marginLeft')) + deltaX
        horLine.css('marginLeft', marginLeft)
        //改变对齐线的值
        var newValue = (this.startX + marginLeft) / this.scale >> 0
        horLine.find('p').html(newValue)

      }.bind(this))

      $(document).one('mouseup', function(event) {
        event.preventDefault()

        //改变对齐线位置
        var index = this.horLine.indexOf(horLine)
        var newValue = horLine.find('p').html() >> 0

        // 如果位置与拖动前相比发生了改变,传播事件
        if (this.horLineValue[index] != newValue) {
          // 超出标尺的刻度范围
          if (newValue < this.startX || newValue > this.startX + this.width / this.ratio) {
            // 删除元素
            var index = this.horLine.indexOf(horLine)
            this.horLine.splice(index, 1)
            this.horLineValue.splice(index, 1)
            // 移除dom
            horLine.remove()
          } else {
            this.horLineValue[index] = newValue
          }
          // 通知对齐线数据改变
          $(document.body).trigger('setAlignLine', {
            horValue : this.horLineValue,
            verValue : this.verLineValue
          })
        }
        //解绑事件
        $(document).off('mousemove')
      }.bind(this))
    }.bind(this))
  }
  //新增一条对齐线
  _addVerLine (value) {

    var verLine = this.factory.getVerLine()
    var offsetY = value * this.scale - this.startY

    verLine.css('marginTop', offsetY)
    verLine.find('p').html(value)
    this.verDiv.append(verLine)
    this.verLine.push(verLine)
    //点击删除图标移除该对齐线
    verLine.find('span').one('click', function(){
      // 事件解绑
      verLine.off('mouseenter')
      verLine.off('mouseleave')
      // verLine.off('mousedown')
      // 删除元素
      var index = this.verLine.indexOf(verLine)
      this.verLine.splice(index, 1)
      this.verLineValue.splice(index, 1)
      //移除dom
      verLine.remove()
      //通知事件
      $(document.body).trigger('setAlignLine', {
        horValue : this.horLineValue,
        verValue : this.verLineValue
      })
    }.bind(this))

    //增加拖动事件
    verLine.on('mousedown', function(e) {
      e.preventDefault()
      var startY = e.clientY

      $(document).on('mousemove', function(event) {
        event.preventDefault()
        var deltaY = event.clientY - startY
        startY = event.clientY

        //改变对齐线的位置
        var marginTop = parseInt(verLine.css('marginTop')) + deltaY
        verLine.css('marginTop', marginTop)
        //改变对齐线的值
        var newValue = (this.startY + marginTop) / this.scale >> 0
        verLine.find('p').html(newValue)

      }.bind(this))

      $(document).one('mouseup', function(event) {
        event.preventDefault()

        //改变对齐线位置
        var index = this.verLine.indexOf(verLine)
        var newValue = verLine.find('p').html() >> 0

        //如果位置与拖动前相比发生了改变,传播事件
        if (this.verLineValue[index] != newValue) {
          if (newValue < this.startY || newValue > this.startY + this.height / this.ratio) {
            // 删除元素
            var index = this.verLine.indexOf(verLine)
            this.verLine.splice(index, 1)
            this.verLineValue.splice(index, 1)
            //移除dom
            verLine.remove()
          } else {
            this.verLineValue[index] = newValue
          }
          $(document.body).trigger('setAlignLine', {
            horValue : this.horLineValue,
            verValue : this.verLineValue
          })
        }
        //解绑事件
        $(document).off('mousemove')
      }.bind(this))
    }.bind(this))
  }
  //绘制当前所有对齐线
  _drawHorLine () {
    $.each(this.horLineValue, function(index, value) {
      var me = this.horLine[index]
      var offsetX = value * this.scale - this.startX
      if(offsetX < 0 || offsetX > this.width / this.ratio){
        me.css({
          display: 'none'
        })
      }else{
        me.css({
          display: 'block',
          marginLeft: offsetX
        })
        me.find('p').html(value)
      }
    }.bind(this))
  }
  _drawVerLine () {
    $.each(this.verLineValue, function(index, value) {
      var me = this.verLine[index]
      var offsetY = value * this.scale - this.startY
      if(offsetY < 0 || offsetY > this.height / this.ratio){
        me.css({
          display: 'none'
        })
      }else{
        me.css({
          display: 'block',
          marginTop: offsetY
        })
        me.find('p').html(value)
      }
    }.bind(this))
  }

  _setPosition (startX, startY) {
    if(this.startX != startX){
      this.startX = startX
      this._drawHorRuler()
    }
    if(this.startY != startY){
      this.startY = startY
      this._drawVerRuler()
    }
  }
  _drawRuler () {
    this._drawHorRuler()
    this._drawVerRuler()
  }
  _drawHorRuler () {
    var start = this.startX
    var ctx = this.horCtx

    //绘制刻度尺的背景
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.width, this.thick)

    //先根据iphone宽度绘制阴影
    if (this.shadow) {
      //阴影起点坐标
      var posX = (this.shadow.x * this.scale - start) * this.ratio
      //阴影宽度
      var width = this.shadow.width * this.ratio * this.scale
      ctx.fillStyle = this.shadowColor
      ctx.fillRect(posX, 0, width, this.thick)
    }
    //再画刻度和文字(因为刻度遮住了阴影)
    //移动画布原点,方便绘制
    ctx.translate(-start * this.ratio, 0)

    ctx.beginPath() //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
    ctx.fillStyle = this.fontColor

    var perWidth = this.perWidth
    var scale = this.scale
    var startX = start - start % perWidth
    for (var i = startX; i < startX + this.width / this.ratio; i += perWidth) {

      var tempX = ((i >> 0) + 0.5) * this.ratio
      ctx.moveTo(tempX, this.thick)
      //绘制长刻度
      if (i % (perWidth * 10) === 0) {
        ctx.fillText(i / scale, (i + 4) * this.ratio, this.thick / 3)
        ctx.lineTo(tempX, 0)
      } else { //绘制短刻度
        ctx.lineTo(tempX, this.thick * 2 / 3)
      }
      ctx.stroke()
    }

    ctx.closePath()

    ctx.translate(start * this.ratio, 0)
  }
  _drawVerRuler () {
    var start = this.startY
    var ctx = this.verCtx

    //绘制刻度尺的背景
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.thick, this.height)

    //先根据iphone高度绘制阴影
    if (this.shadow) {
      //阴影起点坐标
      var posY = (this.shadow.y * this.scale - start) * this.ratio
      var height = this.shadow.height * this.ratio * this.scale
      ctx.fillStyle = this.shadowColor
      ctx.fillRect(0, posY, this.thick, height)
    }

    //再画刻度和文字(因为刻度遮住了阴影)
    //移动画布原点,方便绘制
    ctx.translate(0, -start * this.ratio)

    ctx.beginPath()
    ctx.fillStyle = this.fontColor

    var perHeight = this.perWidth
    var scale = this.scale

    var startY = start - start % perHeight
    for (var i = startY; i < startY + this.height / this.ratio; i += perHeight) {
      var tempY = ((i >> 0) + 0.5) * this.ratio
      ctx.moveTo(this.thick, tempY)
      //绘制长刻度
      if (i % (perHeight * 10) === 0) {
        //这里先保存一下状态
        ctx.save()
        //将原点转移到当前画笔所在点
        ctx.translate(this.thick, (i - 2) * this.ratio)
            //旋转 -90 度
        ctx.rotate(-Math.PI / 2)
            //画文字
        ctx.fillText(i / scale, 2 * this.ratio, -this.thick / 3 * 2)
            //回复刚刚保存的状态
        ctx.restore()
        ctx.lineTo(0, tempY)

      } else { //绘制短刻度
        ctx.lineTo(this.thick * 2 / 3, tempY)
      }
      ctx.stroke()
    }
    ctx.closePath()
    ctx.translate(0, start * this.ratio)
  }
  setSelect (x, y, width, height) {
    this.shadow = {
      x: x,
      y: y,
      width: width,
      height: height
    }
    this._drawRuler()
  }
  clearShadow () {
    this.shadow = null
    this._drawRuler()
  }
  update () {
    var elem = this.elem
    var top = elem.scrollTop()
    var left = elem.scrollLeft()
    this._setPosition(this.originX + left, this.originY + top)
    this._drawAlignLine()
  }

  destroy () {
    // 事件解绑
    this.horRuler.off('click')
    this.verRuler.off('click')
    this.horRuler.off('mousemove')
    this.verRuler.off('mousemove')
    // 移除dom
    this.rulerBox.remove()
    //移除对齐线
    this._destroyHorLine()
    this._destroyVerLine()
    this.elem.removeData('ruler')
  }
  _destroyHorLine (){
    //解绑每个对齐线的时间
    $.each(this.horLine, function(index, elem){
      elem.find('span').off('click')
      elem.off('mouseover')
      elem.off('mouseleave')
      // elem.off('mousedown')
    })
    //移除对齐线container
    this.horDiv.remove()
  }
  _destroyVerLine (){
    //解绑每个对齐线的事件
    $.each(this.verLine, function(index, elem){
      elem.find('span').off('click')
      elem.off('mouseover')
      elem.off('mouseleave')
      // elem.off('mousedown')
    })
    //移除对齐线container
    this.verDiv.remove()
  }
}
