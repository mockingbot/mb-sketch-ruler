/**
 * 2016.6.11 iny
 * jquery插件v0.2 直接append canvas
 */
(function($) {

  $.fn.getRuler = function(options) {
    var me = this
    var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me, options)
    return ruler
  }

  var getPixelRatio = function() {
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

  var RulerFactory = function(options){
    var ratio = options.ratio
    var thick = options.thick
    var width = options.width
    var height = options.height
    var fgColor = options.fgColor
    var bgColor = options.bgColor
    var font = options.font
    var lineColor = options.lineColor

    return {
      getCorner: function(){
        var corner = $('<span></span>')
        corner.css({
          position: 'absolute',
          width: thick - 1,
          height: thick - 1,
          borderBottom: '1px solid ' + fgColor,
          borderRight: '1px solid ' + fgColor,
          'zIndex': 9999,
          backgroundColor: bgColor
        })
        return corner
      },
      getHorRuler: function(){
        var horRuler = $('<canvas></canvas>')
        horRuler.css({
          position: 'fixed',
          marginLeft: thick,
          width: width,
          height: thick - 1,
          borderBottom: '1px solid '+ fgColor,
          'zIndex': 9999,
          backgroundColor: bgColor
          // userSelect: 'none'
        })
        //为canvas设置样式
        var canvas = horRuler.get(0)
        canvas.width = width * ratio
        canvas.height = thick * ratio

        var ctx = canvas.getContext('2d')
        //设置字体以及刻度的样式
        ctx.font = font
        ctx.lineWidth = ratio
        ctx.strokeStyle = fgColor
        ctx.textBaseline = 'middle'
        return horRuler
      },
      getVerRuler: function(){
        var verRuler = $('<canvas></canvas>')
        verRuler.css({
          position: 'fixed',
          marginTop: thick,
          width: thick - 1,
          height: height,
          borderRight: '1px solid ' + fgColor,
          'z-index': 9999,
          backgroundColor: bgColor
        })
        //为canvas设置样式
        var canvas = verRuler.get(0)
        canvas.width = thick * ratio
        canvas.height = height * ratio

        var ctx = canvas.getContext('2d')
        //设置字体以及刻度的样式
        ctx.font = font
        ctx.lineWidth = ratio
        ctx.strokeStyle = fgColor
        ctx.textBaseline = 'middle'
        return verRuler
      },
      getHorLine: function(){
        var horLine = $('<div></div>')
        horLine.css({
          position: 'fixed',
          height: height + thick,
          borderLeft: '1px solid ' + lineColor,
          width: 8,
          // cursor: 'ew-resize'
        })
        //文字
        var text = $('<p></p>')
        text.css({
          position:'absolute',
          left: 5,
          top: thick + 3,
          pointerEvents: 'none'
        })
        horLine.append(text)
        // 删除图标
        var span = $('<span>×</span>')
        span.css({
          position:'absolute',
          display: 'none',
          lineHeight: 1,
          fontSize: 14,
          right:'100%',
          padding: '0 5px 5px 5px',
          top: thick + 3,
          cursor: 'pointer'
        })
        horLine.append(span)

        horLine.on('mouseover', function(e) {
          e.preventDefault()
          var offset = e.offsetY
          if(offset > thick){
            span.show()
          }
        })

        horLine.on('mouseleave', function(e) {
          e.preventDefault()
          span.hide()
        })
        return horLine
      },
      getVerLine: function(){
        var verLine = $('<div></div>')
        verLine.css({
          position: 'fixed',
          width: width + thick,
          borderTop: '1px solid ' + lineColor,
          height: 8,
          'zIndex': 10000,
          // cursor: 'ns-resize'
        })
        //文字
        var text = $('<p></p>')
        text.css({
          position:'absolute',
          top: 5,
          left: thick + 3,
          pointerEvents: 'none'
        })

        verLine.append(text)
        // 删除图标
        var span = $('<span>×</span>')
        span.css({
          position:'absolute',
          display: 'none',
          bottom: '100%',
          padding: 5,
          left: thick + 3,
          lineHeight: 1,
          fontSize: 14,
          cursor: 'pointer'
        })
        verLine.append(span)

        verLine.on('mouseover', function(e) {
          e.preventDefault()
          var offset = e.offsetX
          if(offset > thick){
            span.show()
          }
        })
        verLine.on('mouseleave', function(e) {
          e.preventDefault()
          span.hide()
        })
        return verLine
      },
      getHorCur: function(){
        var horCur = $('<div></div>')
        horCur.css({
          position: 'fixed',
          height: thick,
          outline: 'none',
          borderRight: '1px solid ' + lineColor,
          display: 'none',
          pointerEvents: 'none'
        })
        var div = $('<div></div>')
        div.css({
          position: 'absolute',
          top: '100%',
          borderRight: '1px dotted ' + lineColor,
          height: height
        })
        horCur.append(div)
        var text = $('<p></p>')
        text.css({
          position: 'absolute',
          bottom: '66%',
          transform: 'translateY(50%)',
          backgroundColor: bgColor,
          marginLeft: 4
        })
        horCur.append(text)
        return horCur
      },
      getVerCur: function(){
        var verCur = $('<div></div>')
        verCur.css({
          position: 'fixed',
          width: thick,
          outline: 'none',
          borderBottom: '1px solid ' + lineColor,
          display: 'none',
          pointerEvents: 'none'
        })
        var div = $('<div></div>')
        div.css({
          position: 'absolute',
          left: '100%',
          borderBottom: '1px dotted ' + lineColor,
          width: width
        })
        verCur.append(div)
        var text = $('<p></p>')
        text.css({
          position: 'absolute',
          left: '33%',
          bottom: 0,
          backgroundColor: bgColor,
          marginBottom: 4,
          'transformOrigin': '0% 50%',
          transform: 'translateY(50%) rotate(-90deg)'
        })
        verCur.append(text)
        return verCur
      }
    }
  }

  var Ruler = function(elem, options) {
    // console.log("创建ruler")
    this.elem = elem
    this._init(options)
  }

  //方法
  Ruler.prototype = {
    _init: function(options) {
      //参数默认处理
      options = options || {}
      this.ratio = !isNaN(options.ratio) ? options.ratio : getPixelRatio()
      // this.ratio = 1
      //标尺起始坐标
      this.originX = !isNaN(options.startX) ? options.startX : -240
      this.originY = !isNaN(options.startY) ? options.startY : -100

      this.thick = !isNaN(options.thick) ? options.thick * this.ratio : 30 * this.ratio
      //每一小格的宽度
      this.perWidth = options.perWidth ? parseFloat(options.perWidth) : 10
      // this.perWidth = 7.5
      // this.perWidth = 20
      this.scale = this.perWidth / 10

      this.bgColor = options.bgColor || '#F5F5F5'
      this.fgColor = options.fgColor || '#999'
      this.shadowColor = options.shadowColor || '#CCC'
      this.font = options.font || 12 * this.ratio + 'px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
      this.fontColor = options.fontColor || '#000'
      this.lineColor = options.lineColor || 'red'
      //如果已经初始化,则需要先销毁原有实例
      this.width = this.elem.width() * this.ratio - this.thick
      this.height = this.elem.height() * this.ratio - this.thick

      this.factory = new RulerFactory({
        ratio : this.ratio,
        thick : this.thick / this.ratio,
        width : this.width / this.ratio,
        height : this.height / this.ratio,
        fgColor : this.fgColor,
        bgColor : this.bgColor,
        font : this.font,
        lineColor : this.lineColor
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
    },
    _addRuler: function(){
      var elem = this.elem
      var factory = this.factory
      var rulerBox = $('<div></div>')
      rulerBox.css({
        position: 'fixed',
      })
      this.rulerBox = rulerBox

      //左上角小块
      var corner = factory.getCorner()
      rulerBox.prepend(corner)

      //创建水平标尺
      var horRuler = factory.getHorRuler()
      rulerBox.prepend(horRuler)
      this.horCtx = horRuler.get(0).getContext('2d')

      //水平对齐线container
      var horDiv = $('<div></div>')
      horDiv.css({
        'position': 'fixed',
        'marginLeft': this.thick / this.ratio,
        'zIndex': 10000,
        'userSelect': 'none',
        'font': '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
      })
      rulerBox.prepend(horDiv)
      this.horDiv = horDiv

      //竖直对齐线container
      var verDiv = $('<div></div>')
      verDiv.css({
        'position': 'fixed',
        'marginTop': this.thick / this.ratio,
        'zIndex': 10000,
        'userSelect': 'none',
        'font': '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
      })
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
    },
    _addCurrentValue: function(){
      this._addHorCurrentValue()
      this._addVerCurrentValue()
    },
    _addHorCurrentValue: function(){
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
    },
    _addVerCurrentValue: function(){
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
    },
    _drawAlignLine: function(){
      this._drawHorLine()
      this._drawVerLine()
    },
    _addAlignLine: function(){
      $.each(this.horLineValue, function(index, value){
        this._addHorLine(value)
      }.bind(this))

      $.each(this.verLineValue, function(index, value){
        this._addVerLine(value)
      }.bind(this))
    },
    //新增一条对齐线
    _addHorLine: function(value){
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
      /*
      horLine.on('mousedown', function(e) {
        e.preventDefault();
        var startX = e.clientX;

        $(document).on('mousemove', function(event) {
          event.preventDefault();
          var deltaX = event.clientX - startX
          startX = event.clientX;

          //改变对齐线的位置
          var marginLeft = parseInt(horLine.css('marginLeft')) + deltaX
          horLine.css('marginLeft', marginLeft);
          //改变对齐线的值
          var newValue = (this.startX + marginLeft) / this.scale >> 0
          horLine.find('p').html(newValue)

        }.bind(this));

        $(document).one('mouseup', function(event) {
          event.preventDefault();

          //改变对齐线位置
          var index = this.horLine.indexOf(horLine)
          var newValue = horLine.find('p').html() >> 0

          //如果位置与拖动前相比发生了改变,传播事件
          if(this.horLineValue[index] != newValue){
            this.horLineValue[index] = newValue;
            //通知对齐线位置改变
            $(document.body).trigger('setAlignLine', {
              horValue : this.horLineValue,
              verValue : this.verLineValue
            });
          }

          //解绑事件
          $(document).off('mousemove');

        }.bind(this));

      }.bind(this));
      */
    },
    //新增一条对齐线
    _addVerLine: function(value){

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
      /*
      verLine.on('mousedown', function(e) {
        e.preventDefault();
        var startY = e.clientY;

        $(document).on('mousemove', function(event) {
          event.preventDefault();
          var deltaY = event.clientY - startY
          startY = event.clientY;

          //改变对齐线的位置
          var marginTop = parseInt(verLine.css('marginTop')) + deltaY
          verLine.css('marginTop', marginTop);
          //改变对齐线的值
          var newValue = (this.startY + marginTop) / this.scale >> 0
          verLine.find('p').html(newValue)

        }.bind(this));

        $(document).one('mouseup', function(event) {
          event.preventDefault();

          //改变对齐线位置
          var index = this.verLine.indexOf(verLine)
          var newValue = verLine.find('p').html() >> 0

          //如果位置与拖动前相比发生了改变,传播事件
          if(this.verLineValue[index] != newValue){
            this.verLineValue[index] = newValue;
            $(document.body).trigger('setAlignLine', {
              horValue : this.horLineValue,
              verValue : this.verLineValue
            });
          }
          //解绑事件
          $(document).off('mousemove');

        }.bind(this));

      }.bind(this));
      */
    },
    //绘制当前所有对齐线
    _drawHorLine: function(){
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
    },
    _drawVerLine: function(){
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
    },

    _setPosition: function(startX, startY) {
      if(this.startX != startX){
        this.startX = startX
        this._drawHorRuler()
      }
      if(this.startY != startY){
        this.startY = startY
        this._drawVerRuler()
      }
    },
    _drawRuler: function() {
      this._drawHorRuler()
      this._drawVerRuler()
    },
    _drawHorRuler: function() {
      var start = this.startX
      var ctx = this.horCtx

      //刻度尺背景改用dom的bgcolor实现,这样可以减少ctx.fillStyle状态改变带来的效率损失
      ctx.clearRect(0, 0, this.width, this.thick)

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
        //这样绘制当起点不为10的倍数时,长标和文字都不会出现
        // for(var i = start ; i < start+this.width ; i += 10){
        //正确的方法是:偏移到10的倍数,再开始绘制
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
    },
    _drawVerRuler: function() {
      var start = this.startY
      var ctx = this.verCtx

      //绘制刻度尺的背景
      ctx.clearRect(0, 0, this.thick, this.height)

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
    },
    setSelect: function(x, y, width, height) {
      this.shadow = {
        x: x,
        y: y,
        width: width,
        height: height
      }
      this._drawRuler()
    },
    clearShadow: function() {
      this.shadow = null
      this._drawRuler()
    },
    update: function() {
      var elem = this.elem
      var top = elem.scrollTop()
      var left = elem.scrollLeft()
      this._setPosition(this.originX + left, this.originY + top)
      this._drawAlignLine()
    },

    destroy: function() {
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
    },
    _destroyHorLine: function(){
      //解绑每个对齐线的时间
      $.each(this.horLine, function(index, elem){
        elem.find('span').off('click')
        elem.off('mouseover')
        elem.off('mouseleave')
        // elem.off('mousedown')
      })
      //移除对齐线container
      this.horDiv.remove();
    },
    _destroyVerLine: function(){
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
})(jQuery)
