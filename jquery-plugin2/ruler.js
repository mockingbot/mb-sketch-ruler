/**
 * 2016.6.11 iny
 * jquery插件v0.2 直接append canvas
 */
(function($) {

    $.fn.getRuler = function(options) {
        var me = this;
        var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me, options)
        return ruler;
    };

    var getPixelRatio = function() {
        var context = document.createElement('canvas').getContext('2d')

        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        // console.log("当前设备像素倍数: ", window.devicePixelRatio)
        return (window.devicePixelRatio || 1) / backingStore;
    };

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
        getCorner : function(){
          var corner = $('<span></span>')
          corner.css({
              position: 'fixed',
              width: thick - 1,
              height: thick - 1,
              borderBottom: '1px solid ' + fgColor,
              borderRight: '1px solid ' + fgColor,
              'zIndex': 9999,
              backgroundColor: bgColor
          });
          return corner;
        },
        getHorRuler : function(){
          var horRuler = $('<canvas></canvas>')
          horRuler.css({
              position: 'fixed',
              marginLeft: thick,
              width: width,
              height: thick - 1,
              borderBottom: '1px solid '+ fgColor,
              'zIndex': 9999,
              backgroundColor: bgColor
          });

          //为canvas设置样式
          var canvas = horRuler.get(0);
          canvas.width = width * ratio
          canvas.height = thick * ratio

          var ctx = canvas.getContext('2d');
          //设置字体以及刻度的样式
          ctx.font = font
          ctx.lineWidth = ratio
          ctx.strokeStyle = fgColor
          ctx.textBaseline = 'middle'
          return horRuler;
        },
        getVerRuler : function(){
          var verRuler = $('<canvas></canvas>')
          verRuler.css({
              position: 'fixed',
              marginTop: thick,
              width: thick - 1,
              height: height,
              borderRight: '1px solid ' + fgColor,
              'z-index': 9999,
              backgroundColor: bgColor
          });

          //为canvas设置样式
          var canvas = verRuler.get(0);
          canvas.width = thick * ratio
          canvas.height = height * ratio

          var ctx = canvas.getContext('2d');
          //设置字体以及刻度的样式
          ctx.font = font
          ctx.lineWidth = ratio
          ctx.strokeStyle = fgColor
          ctx.textBaseline = 'middle'
          return verRuler;
        },
        getHorLine : function(){
          var horLine = $('<div></div>')
          horLine.css({
            position: 'fixed',
            height: height + thick,
            borderLeft: '1px solid ' + lineColor,
            width: 5
            // cursor: 'ew-resize',
            // pointerEvents: cancelSelect ? 'none' : 'auto',
          });
          // console.log(horLine.css('pointerEvents'))
          //文字
          var text = $('<p></p>')
          text.css({
            position:'absolute',
            paddingLeft: 3,
            top: thick + 3,
            font: '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
          });
          horLine.append(text)
          //图标
          var span = $('<span>×</span>')
          span.css({
            position:'absolute',
            display: 'none',
            left:'100%',
            padding: 5,
            top: thick + 3,
            fontSize: 14,
            cursor: 'pointer'
          });
          horLine.append(span)

          horLine.on('mouseenter', function(e) {
            e.preventDefault();
            var offset = e.offsetY;
            if(offset > thick){
              span.css({
                top: offset - 10,
                left: 0
              });
              span.show();
            }
            /*进入可拖动状态*/
            // horLine.data('dragable', true)
          });

          horLine.on('mouseleave', function(e) {
            e.preventDefault();
            span.hide();
            /*退出可拖动状态*/
            // horLine.data('dragable', false)
          });
          return horLine;
        },
        getVerLine : function(){
          var verLine = $('<div></div>')
          verLine.css({
            position: 'fixed',
            width: width + thick,
            borderTop: '1px solid ' + lineColor,
            height: 5,
            // cursor: 'ns-resize',
            'zIndex': 10000
          });
          //文字
          var text = $('<p></p>')
          text.css({
            position:'absolute',
            paddingTop: 3,
            left: thick + 3
          });
          verLine.append(text)
          //图标
          var span = $('<span>×</span>')
          span.css({
            position:'absolute',
            display: 'none',
            bottom:'100%',
            padding: 5,
            left: thick + 3,
            fontSize: 14,
            cursor: 'pointer'
          });
          verLine.append(span)

          verLine.on('mouseenter', function(e) {
              e.preventDefault();
              var offset = e.offsetX;
              if(offset > thick){
                span.css({
                  left: e.offsetX - 10
                });
                span.show();
              }
          });
          verLine.on('mouseleave', function(e) {
            e.preventDefault();
            span.hide();
          });
          return verLine;
        },
        getHorCur : function(){
          
          var horCur = $('<div></div>')
          horCur.css({
            position: 'fixed',
            height: thick,
            outline: 'none',
            borderRight: '1px solid ' + lineColor,
            display: 'none',
            pointerEvents: 'none'
          });
          var text = $('<p></p>')
          text.css({
            position: 'absolute',
            bottom: '66%',
            transform: 'translateY(50%)',
            paddingLeft: 4
          });
          horCur.append(text);
          return horCur;
        },
        getVerCur : function(){
          
          var verCur = $('<div></div>')
          
          verCur.css({
            position: 'fixed',
            width: thick,
            outline: 'none',
            borderBottom: '1px solid ' + lineColor,
            display: 'none',
            pointerEvents: 'none'
          });
          var text = $('<p></p>')
          text.css({
            position: 'absolute',
            left: '33%',
            bottom: 0,
            paddingLeft: 4,
            'transformOrigin': '0% 50%',
            transform: 'translateY(50%) rotate(-90deg)'
          });
          verCur.append(text);
          return verCur;
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
            this.startX = !isNaN(options.startX) ? options.startX : -240;
            // console.log(this.startX)
            this.startY = !isNaN(options.startY) ? options.startY : -100;
            
            this.thick = !isNaN(options.thick) ? options.thick * this.ratio : 30 * this.ratio;
            this.bgColor = options.bgColor || '#F5F5F5';
            this.fgColor = options.fgColor || '#999';
            this.shadowColor = options.shadowColor || '#CCC';
            this.font = options.font || 12 * this.ratio + 'px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif';
            this.fontColor = options.fontColor || '#000';
            this.lineColor = options.lineColor || 'red';
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

            //对齐线信息
            this.horLineValue = options.horLineValue || [];
            this.verLineValue = options.verLineValue || [];
            // this.horLineValue = [0, 50]
            // this.verLineValue = [20, 100]
            this.horLine = [];
            this.verLine = [];
            // console.log(this.horLineValue == undefined)
            // this.horLineValue = 20
            // this.verLineValue = 840

            //起始位置
            this.originX = this.startX
            this.originY = this.startY
            
            this._addRuler();
            this._drawRuler();
            this._addAlignLine();
            // this._drawAlignLine();

            this.elem.data('ruler', this);
            this._initScrollEvent();
            
        },
        _addRuler() {
            var elem = this.elem;
            var factory = this.factory;
            //父元素改为scroll
            elem.css({
              overflow: 'scroll'
            });
            //左上角小块
            var corner = factory.getCorner();
            elem.prepend(corner)

            //创建水平标尺
            var horRuler = factory.getHorRuler();
            elem.prepend(horRuler)
            this.horCtx = horRuler.get(0).getContext('2d')

            //水平对齐线container
            var horDiv = $('<div></div>')
            horDiv.css({
              'position': 'fixed',
              'marginLeft': this.thick / this.ratio,
              'zIndex': 10000,
              'font': '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
            });
            elem.prepend(horDiv);
            this.horDiv = horDiv;

            //竖直对齐线container
            var verDiv = $('<div></div>')
            verDiv.css({
              'position': 'fixed',
              'marginTop': this.thick / this.ratio,
              'zIndex': 10000,
              'font': '12px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
            });
            elem.prepend(verDiv);
            this.verDiv = verDiv;
            
            //点击标尺绘制对齐线
            horRuler.on('click', function(event) {
              event.preventDefault();
              var value = event.offsetX + this.startX
              this.horLineValue.push(value);
              this._addHorLine(value)
              $(document.body).trigger('setAlignLine', {
                horValue : this.horLineValue,
                verValue : this.verLineValue
              });
            }.bind(this));

            //创建垂直标尺
            var verRuler = factory.getVerRuler();
            elem.prepend(verRuler)
            this.verCtx = verRuler.get(0).getContext('2d')
            
            //点击标尺绘制对齐线
            verRuler.on('click', function(event) {
              event.preventDefault();
              var value = event.offsetY + this.startY
              this.verLineValue.push(value)
              this._addVerLine(value);
              $(document.body).trigger('setAlignLine', {
                horValue : this.horLineValue,
                verValue : this.verLineValue
              });
            }.bind(this));
            
            this.horRuler = horRuler;
            this.verRuler = verRuler;
            this.corner = corner;

            this._addCurrentValue();
        },
        _addCurrentValue(){
          this._addHorCurrentValue();
          this._addVerCurrentValue();
        },
        _addHorCurrentValue(){
          var factory = this.factory;
          var horCur = factory.getHorCur();
          var horSpan = horCur.find('p');
          var horRuler = this.horRuler;
          
          this.horDiv.prepend(horCur)
          
          //当鼠标进入标尺时,显示刻度,禁止对齐线的鼠标事件
          horRuler.on('mouseenter', function(event) {
            event.preventDefault();
            this.horDiv.css('pointerEvents', 'none');
            horCur.css({
              display: 'block'
            });
            
          }.bind(this));
          
          //当鼠标在标尺上移动时,改变鼠标指向的刻度
          horRuler.on('mousemove', function(event) {
            event.preventDefault();
            var value = this.startX + event.offsetX
            horCur.css({
              marginLeft: event.offsetX
            });
            horSpan.html(value)
          }.bind(this));

          //当鼠标离开标尺时,隐藏刻度,恢复对齐线的鼠标事件
          horRuler.on('mouseout', function(event) {
            event.preventDefault();
            this.horDiv.css('pointerEvents', 'auto');
            horCur.css({
              display: 'none'
            });
          }.bind(this));
        },
        _addVerCurrentValue(){
          var factory = this.factory;
          var verCur = factory.getVerCur();
          var verSpan = verCur.find('p');
          var verRuler = this.verRuler;
          
          this.verDiv.prepend(verCur)

          //当鼠标进入标尺时,显示刻度,禁止对齐线的鼠标事件
          verRuler.on('mouseenter', function(event) {
            event.preventDefault();
            this.verDiv.css('pointerEvents', 'none');
            verCur.css({
              display: 'block'
            });
            
          }.bind(this));
          //当鼠标在标尺上移动时,改变鼠标指向的刻度
          verRuler.on('mousemove', function(event) {
            event.preventDefault();
            var value = this.startY + event.offsetY
            verCur.css({
              marginTop: event.offsetY
            });
            verSpan.html(value)
          }.bind(this));

          //当鼠标离开标尺时,隐藏刻度,恢复对齐线的鼠标事件
          verRuler.on('mouseout', function(event) {
            event.preventDefault();
            this.verDiv.css('pointerEvents', 'auto');
            verCur.css({
              display: 'none'
            });
          }.bind(this));
        },
        _drawAlignLine(){
          this._drawHorLine();
          this._drawVerLine();
        },
        _addAlignLine(){
          $.each(this.horLineValue, function(index, value){
            this._addHorLine(value);
          }.bind(this))

          $.each(this.verLineValue, function(index, value){
            this._addVerLine(value);
          }.bind(this))
        },
        //新增一条对齐线
        _addHorLine(value){
          var horLine = this.factory.getHorLine()
          var offsetX = value - this.startX
          horLine.css('marginLeft', offsetX);
          horLine.find('p').html(value)
          this.horDiv.append(horLine)

          this.horLine.push(horLine);
          //点击删除图标移除该对齐线
          horLine.find('span').one('click', function(){
            // 事件解绑
            horLine.off('mouseenter');
            horLine.off('mouseleave');
            // 删除元素
            var index = this.horLineValue.indexOf(value)
            this.horLine.splice(index, 1);
            this.horLineValue.splice(index, 1);
            //移除dom
            horLine.remove()
            //通知事件
            $(document.body).trigger('setAlignLine', {
              horValue : this.horLineValue,
              verValue : this.verLineValue
            });
          }.bind(this));
        },
        //新增一条对齐线
        _addVerLine(value){
          
          var verLine = this.factory.getVerLine()

          var offsetY = value - this.startY
          verLine.css('marginTop', offsetY);
          verLine.find('p').html(value)
          this.verDiv.append(verLine)

          this.verLine.push(verLine);
          //点击删除图标移除该对齐线
          verLine.find('span').one('click', function(){
            // 事件解绑
            verLine.off('mouseenter');
            verLine.off('mouseleave');
            // 删除元素
            var index = this.verLineValue.indexOf(value)
            this.verLine.splice(index, 1);
            this.verLineValue.splice(index, 1);
            //移除dom
            verLine.remove()
            //通知事件
            $(document.body).trigger('setAlignLine', {
              horValue : this.horLineValue,
              verValue : this.verLineValue
            });
          }.bind(this))
        },
        //绘制当前所有对齐线
        _drawHorLine(){
          $.each(this.horLineValue, function(index, value) {
            var me = this.horLine[index];
            var offsetX = value - this.startX
            if(offsetX < 0 || offsetX > this.width / this.ratio){
              me.css({
                display: 'none'
              });
            }else{
              me.css({
                display: 'block',
                marginLeft: offsetX
              });
              me.find('p').html(value)
            }
          }.bind(this));
        },
        _drawVerLine(){
          $.each(this.verLineValue, function(index, value) {
            var me = this.verLine[index];
            var offsetY = value - this.startY
            if(offsetY < 0 || offsetY > this.height / this.ratio){
              me.css({
                display: 'none'
              });
            }else{
              me.css({
                display: 'block',
                marginTop: offsetY
              });
              me.find('p').html(value)
            }
          }.bind(this));
        },

        _initScrollEvent() {
            var elem = this.elem

            //当需要滚动事件时,需要根据当前滚轮位置绘制标尺,而不是傻傻地每次都从头开始
            this.setPosition(this.originX + elem.scrollLeft(), this.originY + elem.scrollTop())

            this.elem.on('scroll', function(event){

              event.preventDefault();
              event.stopPropagation();
              var top = elem.scrollTop()
              var left = elem.scrollLeft()
              
              this.setPosition(this.originX + left, this.originY + top)
              this._drawAlignLine()
            }.bind(this));
        },

        _moveRuler(deltaX, deltaY) {
            this.startX = this.startX + deltaX
            this.startY = this.startY + deltaY
            this._drawRuler();
            if (this.shadow) {
                this.setSelect(this.shadow.x, this.shadow.y, this.shadow.width, this.shadow.height);
            }
        },
        setPosition: function(startX, startY) {
            this.startX = startX;
            this.startY = startY;
            this.elem.scrollLeft(startX - this.originX)
            this.elem.scrollTop(startY - this.originY)
            this._drawRuler();
            if (this.shadow) {
                this.setSelect(this.shadow.x, this.shadow.y, this.shadow.width, this.shadow.height);
            }
        },
        _drawRuler: function() {

            this._drawHorRuler();
            this._drawVerRuler();
        },
        _drawHorRuler: function(posX, width, needShadow) {
            var start = this.startX;
            var posX = typeof posX !== 'undefined' ? posX : 0
            var width = typeof width !== 'undefined' ? width : 320
            var needShadow = needShadow || false;
            var ctx = this.horCtx;

            //刻度尺背景改用dom的bgcolor实现,这样可以减少ctx.fillStyle状态改变带来的效率损失
            ctx.clearRect(0, 0, this.width, this.thick);

            //先根据iphone宽度绘制阴影
            if (needShadow) {
                ctx.fillStyle = this.shadowColor
                ctx.fillRect((posX - start) * this.ratio, 0, width * this.ratio, this.thick);
                // ctx.fillRect(20, 0, 2, this.thick);
            }

            //再画刻度和文字(因为刻度遮住了阴影)
            //移动画布原点,方便绘制
            ctx.translate(-start * this.ratio, 0);

            ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
            ctx.fillStyle = this.fontColor

            var perWidth = 10;
            var startX = start - start % perWidth
                //这样绘制当起点不为10的倍数时,长标和文字都不会出现
                // for(var i = start ; i < start+this.width ; i += 10){
                //正确的方法是:偏移到10的倍数,再开始绘制
            for (var i = startX; i < startX + this.width / this.ratio; i += perWidth) {

                ctx.moveTo((i + 0.5) * this.ratio, this.thick);

                //绘制长刻度
                if (i % 100 === 0) {
                    ctx.fillText(i, (i + 4) * this.ratio, this.thick / 3);
                    ctx.lineTo((i + 0.5) * this.ratio, 0);
                } else { //绘制短刻度
                    ctx.lineTo((i + 0.5) * this.ratio, this.thick * 2 / 3);
                }
                ctx.stroke();
            }
            
            ctx.closePath();

            ctx.translate(start * this.ratio, 0);

        },
        _drawVerRuler: function(posY, height, needShadow) {
            var start = this.startY;
            var posY = typeof posY !== 'undefined' ? posY : 0
            var height = typeof height !== 'undefined' ? height : 568
            var needShadow = needShadow || false;
            var ctx = this.verCtx;
            
            //绘制刻度尺的背景
            ctx.clearRect(0, 0, this.thick, this.height);

            //先根据iphone高度绘制阴影
            if (needShadow) {
                ctx.fillStyle = this.shadowColor
                ctx.fillRect(0, (posY - start) * this.ratio, this.thick, height * this.ratio);
            }

            //再画刻度和文字(因为刻度遮住了阴影)
            //移动画布原点,方便绘制
            ctx.translate(0, -start * this.ratio);

            ctx.beginPath();
            ctx.fillStyle = this.fontColor

            var perHeight = 10;
            var startY = start - start % perHeight

            for (var i = startY; i < startY + this.height / this.ratio; i += perHeight) {

                ctx.moveTo(this.thick, (i + 0.5) * this.ratio);

                //绘制长刻度
                if (i % 100 === 0) {
                    //这里先保存一下状态
                    ctx.save();
                    //将原点转移到当前画笔所在点
                    ctx.translate(this.thick, (i - 2) * this.ratio)
                        //旋转 -90 度
                    ctx.rotate(-Math.PI / 2)
                        //画文字
                    ctx.fillText(i, 2 * this.ratio, -this.thick / 3 * 2)
                        //回复刚刚保存的状态
                    ctx.restore();
                    ctx.lineTo(0, (i + 0.5) * this.ratio)

                } else { //绘制短刻度
                    ctx.lineTo(this.thick * 2 / 3, (i + 0.5) * this.ratio)
                }
                ctx.stroke();
            }
            ctx.closePath();
            ctx.translate(0, start * this.ratio);
        },
        setSelect: function(x, y, width, height) {

            this._drawHorRuler(x, width, true);
            this._drawVerRuler(y, height, true);
            this.shadow = {
                x: x,
                y: y,
                width: width,
                height: height
            }
        },
        clearShadow: function() {
            this.shadow = null;
            this._drawRuler();
        },

        destroy: function() {
          // 事件解绑
          this.horRuler.off('click')
          this.verRuler.off('click')
          this.horRuler.off('mousemove')
          this.verRuler.off('mousemove')
          this.elem.off('scroll')
          // 移除dom
          this.horRuler.remove()
          this.verRuler.remove()
          this.corner.remove()
          //移除对齐线
          this._destroyHorLine();
          this._destroyVerLine();
          
          this.elem.removeData('ruler')
        },
        _destroyHorLine(){
          //解绑每个对齐线的时间
          $.each(this.horLine, function(index, elem){
            elem.find('span').off('click')
            elem.remove()
          })
          //移除对齐线container
          this.horDiv.remove();
        },
        _destroyVerLine(){
          //解绑每个对齐线的事件
          $.each(this.verLine, function(index, elem){
            elem.find('span').off('click')
            // elem.remove()
          })
          //移除对齐线container
          this.verDiv.remove();
        }
    }
})(jQuery)