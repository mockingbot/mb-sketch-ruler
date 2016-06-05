/**
 * 2016.6.5 iny
 * 为了便于非react环境的调用,改造成jquery插件
 */
(function($){

	$.fn.getRuler = function(){
		var me = this;
		console.log(me.data('ruler'))
		var ruler = me.data('ruler') ? me.data('ruler') : new Ruler(me)
		return ruler;
	};

	var addEvent = (function(){
	    	//对事件对象进行包装
	    	var packEvent = function(event){
	    		var type = event.type;
	    		//如果是ff浏览器的滚轮事件
	    		if (type == 'DOMMouseScroll'){
					//根据axis和detail对事件进行包装,添加一个方向
					//垂直是2,水平是1
					var axis = event.axis;
					//左和上为正方向
					var detail = event.detail;
					//水平方向
	    			if(axis === 1){
	    				if(detail > 5){
	    					event.direction = 'left';
	    				}else if(detail < -5){
	    					event.direction = 'right';
	    				}
	    			}
	    			//垂直方向
	    			else if(axis === 2){
	    				if(detail > 5){
							event.direction = 'top';
	    				}else if(detail < -5){
	    					event.direction = 'bottom';
	    				}
	    			}
	            }
	            //如果是其他浏览器的滚轮事件
	            if(type === 'mousewheel'){
	            	//根据deltaX和deltaY的比较对事件进行包装,添加一个方向
	            	var deltaX = event.deltaX;
					var deltaY = event.deltaY;
					
	            	if(Math.abs(deltaX) - Math.abs(deltaY) > 10){
				    	if(deltaX > 5){
				    		event.direction = 'right';
				    	}else if(deltaX < -5){
				    		event.direction = 'left';
				    	}
				    }else if(Math.abs(deltaY) - Math.abs(deltaX) > 10){
				    	if(deltaY > 5){
				    		event.direction = 'top';
				    	}else if(deltaY < -5){
				    		event.direction = 'bottom';
				    	}
				    }
	            }
	            /* 其他兼容性处理(事件源,冒泡等) */
	            if (event.srcElement && !event.target) {
	                event.target = event.srcElement;    
	            }
	            if (!event.preventDefault && event.returnValue !== undefined) {
	                event.preventDefault = function() {
	                    event.returnValue = false;
	                };
	            }
	            
	            return event;
	    	}
	    	
	    	if (window.addEventListener) {
	            return function(el, type, fn, capture) {
	                //如果是ff,将mousewheel事件改变为ff的类型
	                if (type === "mousewheel" && document.mozHidden !== undefined) {
	                    type = "DOMMouseScroll";
	                }
	                el.addEventListener(type, function(event) {
	                    fn.call(this, packEvent(event));
	                }, capture || false);
	            }
	        } else if (window.attachEvent) {
	            return function(el, type, fn, capture) {
	                el.attachEvent("on" + type, function(event) {
	                    event = event || window.event;
	                    fn.call(el, packEvent(event));
	                });
	            }
	        }
	    })()

	function getWrapper(elem){
		var wrapper = $('<div></div>')
		wrapper.css({
			position: elem.css('position'),
			left: elem.css('left'),
			top: elem.css('top'),
			right: elem.css('right'),
			bottom: elem.css('bottom'),
			width: elem.width(),
			height: elem.height()
		});
		elem.css({
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
		});
		return wrapper;
	}
	var Ruler = function(elem){
		var wrapper = getWrapper(elem)
		elem.wrap(wrapper);
		this.wrapper = elem.parent()
		this.elem = elem
	}

	//方法库
	Ruler.prototype = {

		_destory: function(){
			console.log('销毁原有实例')
			var elem = this.elem;
			console.log(this.doms)
			this.doms.forEach(function(item){
				$(item).remove()
			})
			this.elem.removeData('ruler')
		},
		//为给定元素添加标尺(需要目标元素已定位)
		init : function(options){
			var elem = this.elem;
			var wrapper = this.wrapper;

			if(elem.data('ruler')){
				this._destory();
			}
			
			// parseInt会将空串转换为number类型,我晕
			// this.startX = typeof options.startX !== 'undefined' ? options.startX : -240;
			// this.startY = typeof options.startY !== 'undefined' ? options.startY : -100;
			// this.thick = typeof options.thick !== 'undefined' ? options.thick * 2 : 60;
			options = options || {}
			this.startX = !isNaN(options.startX) ? options.startX : -240;
			this.startY = !isNaN(options.startY) ? options.startY : -100;
			this.thick = !isNaN(options.thick) ? options.thick * 2 : 60;
			this.width = elem.width() * 2 - this.thick
			this.height = elem.height() * 2 - this.thick
			//厚度 其实就是尺子的宽度 但是变量名重复了
			
			//左上角小块
			var corner = $('<span></span>')
			corner.css({
				position: 'absolute',
				width: this.thick / 2 - 1,
				height: this.thick / 2 - 1,
				backgroundColor: '#F5F5F5',
				borderBottom: '1px solid #999',
				borderRight: '1px solid #999',
				'z-index':9999
			});
			
			var cornerDom = corner.get(0);
	  		wrapper.prepend(corner)

			//水平
			var horRuler = $('<canvas></canvas>')
			horRuler.css({
				position: 'absolute',
				top:0,
				left: this.thick / 2,
				width: this.width / 2,
				height: this.thick / 2 - 1,
				borderBottom: '1px solid #999',
				'z-index':9999
			});
			var horRulerDom = horRuler.get(0);
			horRulerDom.width = this.width
			horRulerDom.height = this.thick
			wrapper.prepend(horRuler)

			this.horCtx = horRulerDom.getContext('2d');
			

			//垂直
			var verRuler = $('<canvas></canvas>')
			verRuler.css({
				position: 'absolute',
				top: this.thick / 2,
				left: 0,
				width: this.thick / 2 - 1,
				height: this.height / 2,
				borderRight: '1px solid #999',
				'z-index':9999
			});
			var verRulerDom = verRuler.get(0);
			verRulerDom.width = this.thick
			verRulerDom.height = this.height
			wrapper.prepend(verRuler)

			this.verCtx = verRulerDom.getContext('2d');
			
			this._drawRuler();

			this.elem.data('ruler', this);
			this.doms = [cornerDom, horRulerDom, verRulerDom]
			console.log(this.doms)
			this.initMouseWheelEvent()
		},
		initMouseWheelEvent : function(){
			var _this = this
	    	//使用自定义的事件处理函数,好兼容ff的鼠标滚轮事件
	    	addEvent(document, 'mousewheel', function(event){
	    		event.preventDefault();
	    		console.log(event.target == _this.elem.get(0))
	    		var direction = event.direction;
	    		switch(direction){
	    			case 'top':
		    			//向上划,向下移动
	    				console.log("top")
	    				break;

	    			case 'bottom':
	    				//向下划,向上移动
	    				console.log("down")
	    				break;
	    			
	    			case 'left':
	    				//向左划,向右移动
	    				console.log("right")
	    				break;
	    			
	    			case 'right':
	    				//向右划,向左移动
	    				console.log("left")
	    				break;
	    		}
	    	});
	    },
		setPosition : function(startX, startY){
			this.startX = startX;
			this.startY = startY;
			this._drawRuler();
		},
		_drawRuler : function(){
			this._drawHorRuler();
			this._drawVerRuler();
		},
		_drawHorRuler : function(posX, width, needShadow){
			var start = this.startX;
			console.log(start)
            var posX = typeof posX !== 'undefined' ? posX : 0
            var width = typeof width !== 'undefined' ? width : 320
            var needShadow = needShadow || false;
			var ctx = this.horCtx;
			//绘制刻度尺的背景
			ctx.fillStyle = '#F5F5F5'
			ctx.fillRect(0, 0, this.width, this.thick);

			//先根据iphone宽度绘制阴影
			if(needShadow){
			    ctx.fillStyle = '#CCC'
			    ctx.fillRect((posX - start) * 2, 0, width * 2, this.thick);
			}

			//再画刻度和文字(因为刻度遮住了阴影)
			// ctx.font = '30px Hiragino Sans GB'
			// ctx.font = '30px Microsoft Yahei'
			// ctx.font = '30px Times New Roman'
			ctx.font = '30px -apple-system, ".SFNSText-Regular", "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif'
			// ctx.font = '30px BlinkMacSystemFont'
			// ctx.font = '30px sans-serif'

			//设置底部刻度的样式
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#999'
			//绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
			// ctx.beginPath();
			
			// //border-bottom(border-left对不齐,改用css实现)
			// ctx.moveTo(0, this.thick); 
			// ctx.lineTo(this.width, this.thick);
			// ctx.closePath();
			// ctx.stroke();

			//移动画布原点,方便绘制
			ctx.translate(- start * 2, 0);
			
			ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
			ctx.fillStyle = '#000'

			var perWidth = 10 * 2;
			var startX = start - start % perWidth
			console.log(startX)

			//这样绘制当起点不为10的倍数时,长标和文字都不会出现
			// for(let i = start ; i < start+this.width ; i += 10){
			//正确的方法是:偏移到10的倍数,再开始绘制
			for (let i = startX; i < startX + this.width / 2; i += 10) {
			    
			    ctx.moveTo(i * 2, this.thick);
			    
			    //绘制长刻度
			    if (i % 100 === 0) {
			        ctx.fillText(i, (i + 2) * 2, this.thick / 2);
			        ctx.lineTo(i * 2, 0);
			    } else { //绘制短刻度
			        ctx.lineTo(i * 2, this.thick - perWidth);
			    }
			    ctx.stroke();
			}
			ctx.closePath();

			ctx.translate(start * 2, 0);
		},
		_drawVerRuler : function(posY, height, needShadow){
			var start = this.startY;
	        var posY = typeof posY !== 'undefined' ? posY : 0
	        var height = typeof height !== 'undefined' ? height : 568
	        var needShadow = needShadow || false;
	        var ctx = this.verCtx;
	        //绘制刻度尺的背景
	        ctx.fillStyle = '#F5F5F5'
	        ctx.fillRect(0, 0, this.thick, this.height);

	        //先根据iphone高度绘制阴影
	        if(needShadow){
		        ctx.fillStyle = '#CCC'
		        ctx.fillRect(0, (posY - start) * 2, this.thick, height * 2);
		    }
			
			//再画刻度和文字(因为刻度遮住了阴影)
	        ctx.font = '30px Microsoft Yahei'
	        
	        //设置底部刻度的样式
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = '#999'
	        
	        //绘制底部刻度
	        // ctx.beginPath();
	        
	        // //border-right(border-top对不齐,改用css实现)
	        // ctx.moveTo(this.thick, 0);	
	        // ctx.lineTo(this.thick, this.height);
	        
	        // ctx.closePath();
	        // ctx.stroke();

	        //移动画布原点,方便绘制
	        ctx.translate(0, - start * 2);
	        
	        
	        ctx.beginPath();
	        ctx.fillStyle = '#000'
	        
	        var perHeight = 10 * 2;
	        var startY = start - start % perHeight
			
	        for (let i = startY; i < startY + this.height / 2; i += 10) {
	            
	            ctx.moveTo(this.thick, i * 2);
	            
	            //绘制长刻度
	            if (i % 100 === 0) {
	                //这里先保存一下状态
	                ctx.save();
	                //将原点转移到当前画笔所在点
	                ctx.translate(this.thick / 2, (i - 2) * 2)
	                //旋转 -90 度
	                ctx.rotate(-Math.PI / 2)
					//画文字
	                ctx.fillText(i, 0, 0)
	                //回复刚刚保存的状态
	                ctx.restore();
	                ctx.lineTo(0, i * 2)

	            } else { //绘制短刻度
	                ctx.lineTo(this.thick / 3 * 2, i * 2)
	            }
	            ctx.stroke();
	        }
	        ctx.closePath();
	        ctx.translate(0, start * 2);
		},
		setSelect : function(x, y, width, height){
			if(!this.startX){
				console.log("未初始化,先初始化")
				this.init()
			}
			this._drawHorRuler(x, width, true);
			this._drawVerRuler(y, height, true);
		}
	}
})(jQuery)
