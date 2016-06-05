/*源码阅读计划 
	1.on()  trigger()
	2.get()
	3.css()
	4.type()
	5.addClass()
*/
/* 笔记: 
	1.ES5 中 Array.isArray判断是否是数组
	2.由jquery对象转换为原始对象的函数 get()不传参数(传参数就变成遍历)
*/

/**
 * 2016.4.9 iny
 * 不能再漫无目的地写代码了,要把可以复用的部分总结起来
 * 手势识别? 拖拽?
 */
(function($){

	$.fn.seven = function(options){
		var me = this;
		return new myFunc(me, options);
	};

	var myFunc = function(elem, options){
		
		this.elem = elem;
		this.init(elem);
		
		//如果是数组,为该数组添加宽高属性
		if(Array.isArray(this.elem.get())){
			var arr = this.elem.get();

			var arrWidth = 0;
			var arrHeight = arr.length;
			var arrLength = arr.length;
			var maxLength = 0;
			for(var i = 0 ; i < arrLength ; i ++){
				for(var j = 0 ; j < arr[i].length ; j ++){
					arrWidth = arrWidth > arr[i].length ? maxLength : arr[i].length;
					//对兄弟节点的操作是不是也可以抽出来放到这里啊!
				}
			}
			this.elem.arrMaxLength = arrWidth > arrHeight ? arrWidth : arrHeight;
			this.elem.arrWidth = arrWidth;
			this.elem.arrHeight = arrHeight;

		}
		return this.elem;
		
	}

	//方法库
	myFunc.prototype = {
		
		'init' : function(elem){
			this.initEvent(elem);
		},
		//添加事件
		'addEvent' : (function(){
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
	    })(),
	    
	    //与其使用浏览器嗅探,还不如直接对象检测
		//判断有没有触屏事件
	    'hasTouchEvent' : (function(){
	    	if(document.ontouchstart !== undefined){
	    		return true;
	    	}
	    	return false;
	    })(),

	    //初始化事件
	    'initEvent' : function(elem){
	    	this.remFont()
	    	if(this.hasTouchEvent){
	    		this.initTouchEvent(elem);
	    	}
	    	this.initKeyBoardEvnet(elem);
	    	this.initMouseWheelEvent(elem);
	    },

	    //触摸事件
	    'initTouchEvent' : function(){
	    	var _this = this.elem;

	    	var startX = 0;
	    	var startY = 0;
	    	var endX = 0;
	    	var endY = 0;
	    	document.addEventListener('touchstart',function(event){
	    	    event.stopPropagation();
	    	    startX = event.touches[0].pageX;
	    	    startY = event.touches[0].pageY;
	    	});

	    	document.addEventListener('touchend',function(event){
	    	    
	    	    event.stopPropagation();
	    	    endX = event.changedTouches[0].pageX;
	    	    endY = event.changedTouches[0].pageY;

	    	    var deltaX = endX - startX ;
	    	    var deltaY = endY - startY ;
	    	    //这里判断与event相关的条件能否满足,调用者自身再判断当前状态下能否移动(flag和是否active)
	    	    if(Math.abs(deltaX) - Math.abs(deltaY) > 10){
	    	    	if(deltaX > 5){
	    	    		//向右划,左移动事件
	    	    		console.log("left")
	    	    		$(_this).trigger('leftEvent')
	    	    	}else if(deltaX < -5){
	    	    		//向左划,右移动事件
	    	    		console.log("right")
	    	    		$(_this).trigger('rightEvent')
	    	    	}
	    	    }else if(Math.abs(deltaY) - Math.abs(deltaX) > 10){
	    	    	if(deltaY > 5){
	    	    		//向下划,向上移动
	    	    		$(_this).trigger('topEvent')
	    	    		console.log("top")
	    	    	}else if(deltaY < -5){
	    	    		//向上划,向下移动
	    	    		$(_this).trigger('downEvent')
	    	    		console.log("bottom")
	    	    	}
	    	    }
	    	});
	    },
	    //键盘事件
	    'initKeyBoardEvnet' : function(){
	    	var _this = this.elem;
	    	$(document).keydown(function(event) {
	    		//键盘阻止默认将导致快捷键失效,每次快捷键刷新都要先让窗口失焦,纳闷好几天才突然想到是这里出的问题
	    		// event.preventDefault();
	    		var keyCode = event.keyCode;
	    		switch(keyCode){
	    			case 37:
	    				$(_this).trigger('leftEvent')
	    				break;
	    			case 38:
	    				$(_this).trigger('topEvent')
	    				break;
	    			case 39:
	    				$(_this).trigger('rightEvent')
	    				break;
	    			case 40:
	    				$(_this).trigger('downEvent')
	    				break;
	    			default:
	    				break;
	    		}
	    	});
	    },
	    //鼠标滚轮事件
	    'initMouseWheelEvent' : function(elem){
	    	//使用自定义的事件处理函数,好兼容ff的鼠标滚轮事件
	    	this.addEvent(document, 'mousewheel', function(event){
	    		event.preventDefault();
	    		var direction = event.direction;
	    		switch(direction){
	    			case 'top':
		    			//向上划,向下移动
	    				elem.trigger('downEvent')
	    				break;

	    			case 'bottom':
	    				//向下划,向上移动
	    				elem.trigger('topEvent')
	    				break;
	    			
	    			case 'left':
	    				//向左划,向右移动
	    				elem.trigger('leftEvent')
	    				break;
	    			
	    			case 'right':
	    				//向右划,向左移动
	    				elem.trigger('rightEvent')
	    				break;
	    		}
	    	});
	    },

	    'remFont' : function(){
	    	var docEl = document.documentElement;
	    	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	    	var clientWidth = docEl.clientWidth;
	    	docEl.style.fontSize = Math.round(20 * ( clientWidth/ 320)) + 'px';
	    	var recalc = function() {
	    	    var clientWidth = docEl.clientWidth;
	    	    docEl.style.fontSize = Math.round(20 * ( clientWidth/ 320)) + 'px';
	    	    console.log(docEl.style.fontSize)
	    	    // document.body.style.height = clientWidth * (900 / 1440) + 'px';
	    	}
	    	addEventListener(resizeEvt, recalc, false);
	    	document.addEventListener('DOMContentLoaded', recalc, false);
	    },

	    'fullScreen' : function(){
	    	// 找到适合浏览器的全屏方法
	    	function launchFullScreen(element) {
	    	    if (element.requestFullScreen) {
	    	        element.requestFullScreen();
	    	    } else if (element.mozRequestFullScreen) {
	    	        element.mozRequestFullScreen();
	    	    } else if (element.webkitRequestFullScreen) {
	    	        element.webkitRequestFullScreen();
	    	    }
	    	}
	    	$(document).on('fullScreen', function(){
	    		launchFullScreen(document.documentElement); // the whole page  
	    	})
	    }
	}

	//函数库
	$.seven = {
		'isMobile' : (function(){
			var browser = navigator.userAgent.toLowerCase();
			// console.log(browser)
			if(/iphone/.test(browser)){
				console.log("iphone")
				return true;	
			}else if(/android/.test(browser)){
				console.log("android")
				return true;
			}else 
				return false;
		})()
	}

})(jQuery)


		// this.each(function() {
		// 	var me = $(this)
		// 	var instance = me.data('seven')
		// 	if(!instance){
		// 		instance = new myEvent(me, options);
		// 		me.data('seven', instance)
		// 	}
		// 	console.log("msg")
		// 	return instance;
		// 	// if($.type(options) === "string")
		// 	// 	console.log(instance[options])
		// 	// 	return instance[options]();
		// });
	