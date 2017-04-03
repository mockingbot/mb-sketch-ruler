#A sketch like ruler in javascript [English](https://github.com/mockingbot/A-sketch-like-ruler-in-javascript/blob/master/README.MD)

###简介

Ruler.js是一个基于html5(canvas)的jQuery插件，它可以帮助你在一个div或其他块级元素的左边和上边添加类似Sketch的两个标尺（一个水平、一个垂直）

有些情况下，一个div里面包含的元素太多或太大，我们不得不为他增加滚动条。在这种场景下，当div里的内容滚动到某个位置时，你可能会想知道当前视口内的元素相对与父元素左上角的位置。

####Ruler.js 可以帮助你做到这一点，看看这个: [在线演示](https://mockingbot.github.io/A-sketch-like-ruler-in-javascript/) . 如果您有任何疑问或建议，欢迎提issue.


###使用方法

1. 在html页面中添加 ``jquery`` 依赖和 ``ruler.js`` 文件
2. 为需要添加标尺的元素（以div#demo为例）设置定位以及宽高

		#demo {
			position:absolute;
			/* fixed and relative is alse supposed */
			width: 200px;
			height: 200px;
			/* width and height as you need */
		}

3. 使用ruler.js提供的getRuler方法为div#demo添加标尺

	    var ruler = $('#demo').getRuler()

  getRuler方法有许多配置项，也可以通过不同的参数定制生成的ruler

		var ruler = $('#demo').getRuler({
    		startX: -240,  // 水平方向标尺刻度的起点
        	startY: -100,  // 垂直方向标尺刻度的起点
	        thick: 30,  // 标尺窄边的宽度
    	    fgColor: '#F5F5F5', // 标尺的前景色（刻度颜色）
        	bgColor: '#999',  // 标尺的背景色
	        shadowColor: '#CCC', // 标尺上阴影的颜色（可以通过调用 setSelect()方法绘制阴影
    	    font: '15px -apple-system, '.SFNSText'Regular', "SF'UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif',
        	// * 注意！实际呈现的字体的大小与当前的'ratio'成正比，如需要12px的字体，但ratio为2，需要将字体大小设为24px)
	        fontColor: '#000', // 标尺上标注的数字的颜色
    	    ratio: 2, // canvas的PixelRatio, 普通屏上为1，retina上为2
        	perWidth: 10 // 相邻两个刻度之间的距离（像素为单位）
       });

4. 当#demo元素发生滚动时，根据需求调用update()方法重绘标尺

    	$('#demo').css({
          overflow: 'scroll'  //assign 'scroll' to the 'overflow' attribute
        }).on('scroll', function(event) {
          event.preventDefault();
          ruler.update();
        });

5. 还可以根据需要调用方法``setSelect(x, y, width, height)``在标尺上绘制阴影,就像在这个例子中点击色块一样 [That](https://mockingbot.github.io/A-sketch-like-ruler-in-javascript/)

6. 另外,点击标尺还可以在点击的位置添加一条对齐线,鼠标悬浮在对齐线上可以在标尺附近显示出一个删除按钮,通过点击可以将对齐线删除。新建和删除对齐线都会触发一个jQuery的`setAlignLine`事件，你可以像下面这样监听该事件

		$(document.body).on('setAlignLine', function(event, position) {
         	event.preventDefault();
         	console.log('Horizontal', position.horValue)
         	console.log('Vertical', position.verValue)
      	});

[维护记录](https://github.com/mockingbot/A-sketch-like-ruler-in-javascript/blob/master/NOTE.MD)

###© 2016 [墨刀](https://modao.cc)