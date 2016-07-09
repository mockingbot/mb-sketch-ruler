#A sketch like ruler in javascript [中文介绍](https://github.com/mockingbot/A-sketch-like-ruler-in-javascript/blob/master/README_CN.MD)

###Introduction

Ruler.js is a jQuery plugin based on HTML5 (canvas) which provide you two sketch like rulers (vertical and horizontal) at the left and top of a ``div``or other ``block-level`` HTML Element.


Sometimes, a div contains so many elements in it that you have to add a scroll bar. In this scene, you might want to know the exact position of the elements in your eyes when scrolling is carried out.

####Ruler.js will help you like that: [Use Case](https://mockingbot.github.io/A-sketch-like-ruler-in-javascript/) . Any issue will be appreciated.

###Usage

1. Include ``jquery`` and ``ruler.js`` in your HTML document
2. set the container element's style

		#demo{
			position:absolute;
			/* fixed and relative is alse supposed */
			width: 200px; 
			height: 200px;
			/* width and height as you need */
		}

3. use ruler.js to add rulers on ``div#demo`` like this
	
		var ruler = $('#demo').getRuler()
		
	or configure parameters according to need
		
		var ruler = $('#demo').getRuler({
          startX: -240,  // the start peg of the horizontal ruler
          startY: -100,  // the start peg of the vertical ruler
          thick: 30,  // the width of both ruler
          fgColor: '#F5F5F5', // the foreground color of ruler
          bgColor: '#999',	// the background color of ruler
          shadowColor: '#CCC', // the shadow's color when you call the method 'setSelect()'
          font: '15px -apple-system, '.SFNSText'Regular', "SF'UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif',
          // * Be careful! the font's size is expected to be the size of the n multiple (n equils to the parameter 'ratio')
          fontColor: '#000', // the value tag's color on ruler
          ratio: 2, // canvas PixelRatio, 1 on ordinary display, 2 on retina
          perWidth: 10 // width between two pegs
        });

4. update ruler when the container scroll

		$('#demo').css({
          overflow: 'scroll'  //assign 'scroll' to the 'overflow' attribute 
        }).on('scroll', function(event) {
          event.preventDefault();
          ruler.update();
        });

5. you can alse draw a shadow on the ruler by the method ``setSelect(x, y, width, height)``, in this example, you can click the colorful div like [That](https://mockingbot.github.io/A-sketch-like-ruler-in-javascript/)

6. By the way, the ruler is clickable to draw align line on it, the align line can be deleted when hover on it.Both will trigger a jQuery event, you can listene the event ``setAlignLine`` like this
		
		$(document.body).on('setAlignLine', function(event, position) {
        	event.preventDefault();
	        console.log('Horizontal', position.horValue)
    	    console.log('Vertical', position.verValue)
		});

###© 2016 [MockingBot](https://mockingbot.com)
